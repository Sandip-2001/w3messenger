import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
// import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Types "./Types";
// import Random "mo:base/Random";
import Cycles "mo:base/ExperimentalCycles";
import TrieMap "mo:base/TrieMap";


actor class MyAccount () = this {

  Debug.print("hello myAccount");

  type FileDetails = Types.FileDetails;
  type MsgTime_Date = Types.MsgTime_Date;
  type IndvMessage = Types.IndvMessage;

  private let listOfConnectedProfiles = Buffer.Buffer<Text>(10);

  private let mapOfChats = TrieMap.TrieMap<Text, Buffer.Buffer<IndvMessage>>(Text.equal, Text.hash);

  private let mapOfUnseenMsgs = TrieMap.TrieMap<Text, Nat>(Text.equal, Text.hash);
  
  public func addConnectionProfile(profilePrincipal: Text): async Text{
    listOfConnectedProfiles.add(profilePrincipal);
    mapOfChats.put(profilePrincipal, Buffer.Buffer<IndvMessage>(10));
    return "Successfully added to your list";
  };

  public query func getConnectionsList(): async [Text] {
    return Buffer.toArray<Text>(listOfConnectedProfiles);
  };

  public query func isCurrentFriend(usrName: Text) : async Bool{
    for(usr in mapOfChats.keys()){
      // Debug.print("usr ==> ");
      // Debug.print(debug_show(usr));
      // Debug.print("usrName ==> ");
      // Debug.print(debug_show(usrName));
      if(usr == usrName){
        // Debug.print("True");
        return true;
      };
    };
    //  Debug.print("False");
    return false;
    // return Buffer.contains<Text>(listOfConnectedProfiles, usrName, Text.equal); 
  };

  public func createChat(chatWith: Text, is_sender: Bool, typeOfMsg: Text, message: Text, file: ?FileDetails, meme_url: Text, time_date: MsgTime_Date): async Text {
    let newMsg: IndvMessage = {
      typeOfMsg = typeOfMsg;
      isSender = is_sender;
      msg = message;
      file = file;
      memeUrl = meme_url; 
      time_date = time_date;
    };
    var getChats : Buffer.Buffer<IndvMessage> = switch (mapOfChats.get(chatWith)){
      case null Buffer.Buffer<IndvMessage>(10);
      case (?result) result;
    };
    getChats.add(newMsg);
    mapOfChats.put(chatWith, getChats);
    return "Success";
  };

  public query func getLengthOfChats(usrName: Text): async Nat{
    var getMsgs : Buffer.Buffer<IndvMessage> = switch (mapOfChats.get(usrName)){
      case null Buffer.Buffer<IndvMessage>(10);
      case (?result) result;
    };
    return getMsgs.size();
  };

  public query func getChat(chatWith: Text, ind: Nat): async IndvMessage{
    var getChats : Buffer.Buffer<IndvMessage> = switch (mapOfChats.get(chatWith)){
      case null Buffer.Buffer<IndvMessage>(10);
      case (?result) result;
    };

    return getChats.get(ind);
  };

  public query func getAfterChats(clLength: Nat, svLength: Nat, userPrincipal: Text): async [IndvMessage]{
    var getChats : Buffer.Buffer<IndvMessage> = switch (mapOfChats.get(userPrincipal)){
      case null Buffer.Buffer<IndvMessage>(10);
      case (?result) result;
    };
    let start_index: Int = svLength - clLength - 4;
    Debug.print("start_index => ");
    Debug.print(debug_show (start_index));
    if(start_index < 0){
      let uptoLen: Nat = svLength - clLength;
      getChats := Buffer.subBuffer(getChats, 0, uptoLen);
      Debug.print("uptoLen => ");
      Debug.print(debug_show (uptoLen));
    } else {
      let st_ind: Nat = svLength - clLength - 4;
      getChats := Buffer.subBuffer(getChats, st_ind, 4);
      Debug.print("st_ind => ");
      Debug.print(debug_show (st_ind));
    };
    return Buffer.toArray<IndvMessage>(getChats); 
  };

  public func updateNoOfUnseenMsgs(chatWith: Text) {
    let the_no = await getNoOfUnseenMsgs(chatWith);
    mapOfUnseenMsgs.put(chatWith, the_no+1); 
  };

  public func updateNoOfUnseenMsgsForAll(chatWith: Text, noOfMsgs: Nat) {
    mapOfUnseenMsgs.put(chatWith, noOfMsgs);
  };

  public query func getNoOfUnseenMsgs(chatWith: Text) : async Nat{
    let noOfUnsnMsgs : Nat = switch (mapOfUnseenMsgs.get(chatWith)){
      case null 0;
      case (?result) result;
    };
  };

  public query func getCanisterID() : async Principal {
    return Principal.fromActor(this);
  };


  //uploading chunked files and http request and deleting files

  private var nextChunkID : Nat = 0;
  private let chunks = TrieMap.TrieMap<Nat, Types.Chunk>(Nat.equal, Hash.hash);
  private let assets = TrieMap.TrieMap<Text, Types.Asset>(Text.equal, Text.hash);
  private let assetsDetails = TrieMap.TrieMap<Text, FileDetails>(Text.equal, Text.hash);

  public shared query ({ caller }) func http_request(request: Types.HttpRequest): async Types.HttpResponse{
    if(request.method == "GET"){
      let split : Iter.Iter<Text> = Text.split(request.url, #char '?');
      let key : Text = Iter.toArray(split)[0];
      let asset : ?Types.Asset = assets.get(key);
      switch(asset){
        case(?{content_type: Text; encoding: Types.AssetEncoding;}){
          return {
            body = encoding.content_chunks[0];
            headers = [
              ("Content-Type", content_type),
              ("accept-ranges", "bytes"),
              ("cache-control", "private, max-age=0")
            ];
            status_code = 200;
            streaming_strategy = create_strategy(
              key, 0, {content_type; encoding;}, encoding
            );
          };
        };
        case null {};
      };
    };
    return {
      body = Blob.toArray(Text.encodeUtf8("Permission denied. Could not perform this peration."));
      headers = [];
      status_code = 403;
      streaming_strategy = null;
    };
  };

  private func create_strategy(
    key : Text,
    index : Nat,
    asset : Types.Asset,
    encoding : Types.AssetEncoding
  ): ?Types.StreamingStrategy{
    switch(create_token(key, index, encoding)){
      case (null) {null};
      case (?token) {
        let self : Principal = Principal.fromActor(this);
        let canisterId : Text = Principal.toText(self);
        let canister = actor(canisterId) : actor{http_request_streaming_callback : shared() -> async ()};
        return ?#Callback({
          token;
          callback = canister.http_request_streaming_callback;
        });
      };
    };
  };

  public shared query ({ caller }) func http_request_streaming_callback(
    st: Types.StreamingCallbackToken
  ): async Types.StreamingCallbackHttpResponse{
    switch(assets.get(st.key)){
      case(null) throw Error.reject("key not found: " #st.key);
      case(?asset){
        return {
          token = create_token(st.key, st.index, asset.encoding);
          body = asset.encoding.content_chunks[st.index];
        };
      };
    };
  };

  private func create_token(
    key: Text,
    chunk_index: Nat,
    encoding: Types.AssetEncoding
  ): ?Types.StreamingCallbackToken{
    if(chunk_index + 1 >= encoding.content_chunks.size()){
      null;
    }else{
      ?{
        key;
        index = chunk_index + 1;
        content_encoding = "gzip";
      };
    };
  };

  public shared ({ caller }) func create_chunk(chunk: Types.Chunk): async {chunk_id: Nat}{
    nextChunkID := nextChunkID + 1;
    chunks.put(nextChunkID, chunk);
    return {chunk_id = nextChunkID};
  };

  public shared ({ caller }) func commit_batch(
    {batch_name: Text; chunk_ids: [Nat]; content_type: Text;} : {
      batch_name: Text;
      content_type: Text;
      chunk_ids: [Nat];
    }
  ): async () {
    var content_chunks : [[Nat8]] = [];
    for(chunk_id in chunk_ids.vals()){
      let chunk : ?Types.Chunk = chunks.get(chunk_id);
      switch(chunk){
        case(?{content}){
          content_chunks := Array.append<[Nat8]>(content_chunks, [content]);
        };
        case null {};
      };
    };
    if(content_chunks.size() > 0){
      var total_length = 0;
      for(chunk in content_chunks.vals()) total_length += chunk.size();
      assets.put(Text.concat("/assets/", batch_name), {
        content_type = content_type;
        encoding = {
          modified = Time.now();
          content_chunks;
          certified = false;
          total_length;
        };
      });
    };
    for (chunk_id in chunk_ids.vals()) {
      chunks.delete(chunk_id);
    };
  };

  public func putAssetsDetails(key: Text, assetDetailsObj : FileDetails) {
    assetsDetails.put(key, assetDetailsObj);
  };

  public query func getAssetsDetails(key: Text): async FileDetails{
    let dummyAsset : FileDetails = {
      fileUrl = "";
      fileId = "";
      fileName = "";
      fileSize = "";
      fileType = "";
    };
    var details : FileDetails = switch (assetsDetails.get(key)){
      case null dummyAsset;
      case (?result) result;
    };
    return details;
  };

  public query func getAssetsKeys(): async [Text]{
    return Iter.toArray(assets.keys());
  };
 
  //deleting chats and files

  public func deleteFile(fileNames: [Text]): async Text{
    for(file in fileNames.vals()){
      let key_batch_name = Text.concat("/assets/", file);
      assets.delete(key_batch_name);
      assetsDetails.delete(file);
    };
    return "Successfully deleted those files!";
  };

  public func deleteChats(chatIndexes: [Nat], deleteChatsOf: Text): async Text{
    var getChats : Buffer.Buffer<IndvMessage> = switch (mapOfChats.get(deleteChatsOf)){
      case null Buffer.Buffer<IndvMessage>(10);
      case (?result) result;
    };
    for(msgIndex in chatIndexes.vals()){
      let x = getChats.remove(msgIndex);
    };
    mapOfChats.put(deleteChatsOf, getChats);
    return "Succesfully deleted those messages";
  };

  public func deleteAllChats(deleteChatsOf: Text): async Text{
    var getChats : Buffer.Buffer<IndvMessage> = switch (mapOfChats.get(deleteChatsOf)){
      case null Buffer.Buffer<IndvMessage>(10);
      case (?result) result;
    };
    getChats.clear();
    mapOfChats.put(deleteChatsOf, getChats);
    return "Succesfully deleted all messages";
  };

  public func deleteContact(deleteContactOf: Text, indexOfContact: Nat) : async Text{
    let calculatedIndex : Nat = listOfConnectedProfiles.size() - 1 - indexOfContact;
    let x = listOfConnectedProfiles.remove(calculatedIndex);
    mapOfChats.delete(deleteContactOf);
    mapOfUnseenMsgs.delete(deleteContactOf);
    // Debug.print(debug_show(x.userName));
    return "Successfully deleted";
  };

};