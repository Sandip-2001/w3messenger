import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import MyAccountActorClass "../my_account/myAccount";
// import List "mo:base/List";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Bool "mo:base/Bool";
import TrieMap "mo:base/TrieMap";

actor W3Messenger{

  // Debug.print("hello w3messenger");

  public type NewProfile = {
    principalOfMyAccount : Text;
    userName: Text;
    about: Text;
    imgUrl : [Nat8];
  };

  public type Profile = {
    about: Text;
    imgUrl : [Nat8];
  };

  public type NewRequestedConnectionProfile = {
    status : Text;
    principalOfMyAccount : Text;
    userName: Text;
    profileDetails: ?Profile;
  };

  public type DateTime = {
    date: Text;
    time: Text;
  };

  public type OnlineStatus = {
    isOnline : Bool;
    lastOnline : ?DateTime;
  };

  private let mapOfAccounts = TrieMap.TrieMap<Principal, MyAccountActorClass.MyAccount>(Principal.equal, Principal.hash);

  private let mapOfAccountPrincipal = TrieMap.TrieMap<Text, Principal>(Text.equal, Text.hash);

  private let mapOfRequests = TrieMap.TrieMap<Text, Buffer.Buffer<NewRequestedConnectionProfile>>(Text.equal, Text.hash);
  
  private let mapOfOnlineStatus = TrieMap.TrieMap<Text, OnlineStatus>(Text.equal, Text.hash);
    
  private let userNames = TrieMap.TrieMap<Text, Principal>(Text.equal, Text.hash);

  private let profiles = TrieMap.TrieMap<Text, NewProfile>(Text.equal, Text.hash);

  public query func userNameExists(inputUserName: Text): async Bool{
    for(eachUserName in userNames.keys()){
      if(eachUserName == inputUserName){
        return true;
      }
    };
    return false;
  };

  public query func getUserProfile(userPrincipal: Text):async NewProfile{
    let dummyProfile = {
      principalOfMyAccount = "";
      userName= "";
      about= "User not found";
      imgUrl= [];
    };
    let fetchedUserProfile : NewProfile = switch (profiles.get(userPrincipal)) {
      case null dummyProfile;
      case (?result) result;
    };
    return fetchedUserProfile;
  };

  public shared query(msg) func getMyProfile():async NewProfile{
    let myPrincipal : Principal = msg.caller;
    let textOfMyPrincipal = Principal.toText(myPrincipal);
    let dummyProfile = {
      principalOfMyAccount = "";
      userName= "";
      about= "User not found";
      imgUrl= [];
    };
    let myProfile : NewProfile = switch (profiles.get(textOfMyPrincipal)) {
      case null dummyProfile;
      case (?result) result;
    };
    return myProfile;
  };

  public shared query(msg) func getUserProfileForAdding(user: Text):async NewProfile{
    let fetchedUserPrincipal : Principal = switch (userNames.get(user)){
      case null msg.caller;
      case (?result) result;
    };
    let fetchedUserPrincipalText = Principal.toText(fetchedUserPrincipal);
    let dummyProfile = {
      principalOfMyAccount = "";
      userName= "";
      about= "User not found";
      imgUrl= [];
    };
    let fetchedProfile : NewProfile = switch (profiles.get(fetchedUserPrincipalText)) {
      case null dummyProfile;
      case (?result) result;
    };
    return fetchedProfile;
  };

  // set and get online status
  public shared(msg) func setOnlineStatusTrue(): async Text{
    let myPrincipal : Principal = msg.caller;
    let myPrincipalText = Principal.toText(myPrincipal);
    let newStatus : OnlineStatus = {
      isOnline = true;
      lastOnline = null;
    };
    mapOfOnlineStatus.put(myPrincipalText, newStatus);
    return "Success";
  };

  public shared(msg) func setOnlineStatusFalse(date_time: DateTime): async Text{
    let myPrincipal : Principal = msg.caller;
    let myPrincipalText = Principal.toText(myPrincipal);
    let newStatus : OnlineStatus = {
      isOnline = false;
      lastOnline = ?date_time;
    };
    mapOfOnlineStatus.put(myPrincipalText, newStatus);
    return "Success";
  };

  public query func getOnlineStatus(statusOf: Text): async OnlineStatus{
    let dummyStatus = {
      isOnline = false;
      lastOnline = null;
    };
    let theStatus : OnlineStatus = switch (mapOfOnlineStatus.get(statusOf)){
      case null dummyStatus;
      case (?result) result;
    };
    return theStatus;
  };

  //create and get requests
  public func createRequest(requestUsrPrincipal: Text, myPrincipal: Text, statusText: Text): async Text {
    let myProfile  = await getUserProfile(myPrincipal);
    var myRequestingProfile : NewRequestedConnectionProfile = {
      status = statusText;
      principalOfMyAccount = myPrincipal;
      userName = myProfile.userName;
      profileDetails = null;
    };
    if(statusText == "Successfully requested"){
      let profile_details: Profile = {
        about = myProfile.about;
        imgUrl = myProfile.imgUrl;
      };
      myRequestingProfile := {
        status = statusText;
        principalOfMyAccount = myPrincipal;
        userName = myProfile.userName;
        profileDetails = ?profile_details;
      };
    };
    var getRequests : Buffer.Buffer<NewRequestedConnectionProfile> = switch (mapOfRequests.get(requestUsrPrincipal)){
      case null Buffer.Buffer<NewRequestedConnectionProfile>(10);
      case (?result) result;
    };
    getRequests.add(myRequestingProfile);
    mapOfRequests.put(requestUsrPrincipal, getRequests);
    return "Success";
  };

  public query func isAlreadyRequested(requestUsrPrincipal: Text, myuserPrincipal: Text): async Bool{
    var getRequests : Buffer.Buffer<NewRequestedConnectionProfile> = switch (mapOfRequests.get(requestUsrPrincipal)){
      case null Buffer.Buffer<NewRequestedConnectionProfile>(10);
      case (?result) result;
    };
    for (element in getRequests.vals()) {
      if(element.principalOfMyAccount == myuserPrincipal){
        return true;
      };
    };
    return false;
  };

  public shared query(msg) func getRequestsLength(): async Nat{
    let userPrincipal : Principal = msg.caller;
    let textOfUserPrincipal = Principal.toText(userPrincipal);
    var getReq : Buffer.Buffer<NewRequestedConnectionProfile> = switch (mapOfRequests.get(textOfUserPrincipal)){
      case null Buffer.Buffer<NewRequestedConnectionProfile>(10);
      case (?result) result;
    };
    return getReq.size();
  };

  public shared query(msg) func getRequest(ind: Nat): async NewRequestedConnectionProfile{
    let userPrincipal : Principal = msg.caller;
    let textOfUserPrincipal = Principal.toText(userPrincipal);
    var getReq : Buffer.Buffer<NewRequestedConnectionProfile> = switch (mapOfRequests.get(textOfUserPrincipal)){
      case null Buffer.Buffer<NewRequestedConnectionProfile>(10);
      case (?result) result;
    };
    return getReq.get(ind);
  };

  public shared(msg) func deleteARequest(id: Nat): async Text {
    let userPrincipal : Principal = msg.caller;
    let textOfUserPrincipal = Principal.toText(userPrincipal);
    var getReq : Buffer.Buffer<NewRequestedConnectionProfile> = switch (mapOfRequests.get(textOfUserPrincipal)){
      case null Buffer.Buffer<NewRequestedConnectionProfile>(10);
      case (?result) result;
    };
    let removedReq = getReq.remove(id);
    mapOfRequests.put(textOfUserPrincipal, getReq);
    return "Success";
  };

  public shared(msg) func deleteRequestFor_ChangeInProfile(): async Text{
    let userPrincipal : Principal = msg.caller;
    let textOfUserPrincipal = Principal.toText(userPrincipal);
    var getReq : Buffer.Buffer<NewRequestedConnectionProfile> = switch (mapOfRequests.get(textOfUserPrincipal)){
      case null Buffer.Buffer<NewRequestedConnectionProfile>(10);
      case (?result) result;
    };
    getReq.filterEntries(func(_, x) = x.status != "Change in profile");
    mapOfRequests.put(textOfUserPrincipal, getReq);
    return "Success";
  };


  // create and get your own profile details

  public shared query(msg) func isRegistered():async Bool{
    let myPrincipal : Principal = msg.caller;
    for(eachUserPrincipal in userNames.vals()){
      if(eachUserPrincipal == myPrincipal){
        return true;
      };
    };
    return false;
  };

  public shared(msg) func createAccount(userName: Text, aboutText: Text, imgData: [Nat8]): async Text {

    let userPrincipal : Principal = msg.caller;
    let textOfUserPrincipal = Principal.toText(userPrincipal);

    Cycles.add(500_500_000_000);

    let newAccount = await  MyAccountActorClass.MyAccount();

    let newAccountPrincipal = await newAccount.getCanisterID();

    mapOfAccounts.put(newAccountPrincipal, newAccount);

    mapOfAccountPrincipal.put(textOfUserPrincipal, newAccountPrincipal);

    userNames.put(userName, userPrincipal);

    let createdProfile: NewProfile = {
      principalOfMyAccount = textOfUserPrincipal;
      userName = userName;
      about = aboutText;
      imgUrl = imgData;
    };

    profiles.put(textOfUserPrincipal, createdProfile);

    return "Success";
  };

  public shared query(msg) func getAccountPrincipal(accPrincipalOf: Text): async Principal{
    let fetchedAccountPrincipal : Principal = switch (mapOfAccountPrincipal.get(accPrincipalOf)) {
      case null msg.caller;
      case (?result) result;
    };
    return fetchedAccountPrincipal;
  };

  public shared(msg) func updateUserName(prevUserName: Text, updatedUserName: Text, userPrincipal: Text): async Text {

    let fetchedUserProfile : NewProfile = await getUserProfile(userPrincipal);
    let updatedUserProfile : NewProfile = {
      principalOfMyAccount = fetchedUserProfile.principalOfMyAccount;
      userName = updatedUserName;
      about = fetchedUserProfile.about;
      imgUrl = fetchedUserProfile.imgUrl;
    };
    profiles.put(userPrincipal, updatedUserProfile);

    userNames.delete(prevUserName);
    userNames.put(updatedUserName, msg.caller);

    return "Success";
  };

  public func updateUserAbout(userPrincipal: Text, aboutText: Text): async Text {
    let fetchedUserProfile : NewProfile = await getUserProfile(userPrincipal);
    let updatedUserProfile : NewProfile = {
      principalOfMyAccount = fetchedUserProfile.principalOfMyAccount;
      userName = fetchedUserProfile.userName;
      about = aboutText;
      imgUrl = fetchedUserProfile.imgUrl;
    };
    profiles.put(userPrincipal, updatedUserProfile);
    return "Success";
  };

  public func updateUserImage(userPrincipal: Text, imgData: [Nat8]): async Text {
    let fetchedUserProfile : NewProfile = await getUserProfile(userPrincipal);
    let updatedUserProfile : NewProfile = {
      principalOfMyAccount = fetchedUserProfile.principalOfMyAccount;
      userName = fetchedUserProfile.userName;
      about = fetchedUserProfile.about;
      imgUrl = imgData;
    };
    profiles.put(userPrincipal, updatedUserProfile);
    return "Success";
  };

  
};
