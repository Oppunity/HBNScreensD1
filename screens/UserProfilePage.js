import React, {Component } from 'react';
import {View, Image, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet,ActivityIndicator, Animated, TextInput, TouchableHighlight } from 'react-native';
import {Container, Button} from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';
import OrgRatingFeed from '../components/OrgRatingFeed';
import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
// import { getOrgEvent } from '../graphql/queries'
import { listOrgEvents, listUserPics, listUserInfos } from '../graphql/queries'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import ActionButton from 'react-native-circular-action-menu';
import { StackActions, NavigationActions, withNavigation} from 'react-navigation';
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'
import * as store2 from '../redux/store/followingstore'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

var {width } = Dimensions.get('window')


class UserProfilePage extends Component { 

 static navigationOptions = {
 headerShown: false
 }
 
 constructor(props)
 {
 super(props)
 this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
 //this.enableMessage = this.enableMessage.bind(this);
 //this.timer = setTimeout(this.enableMessage, 1000);
 this.state = {
    isFetching:true,
    displayMessage: false,
    SignInOut: 0,
 numColumnss:2, 
 smash:0,
 heat :0,
 looseness :0,
 thickness :0,
 intelligence :0,
 savageness :0,
 ratchetness :0,
 diversity :0,
 //Default_Rating: 0,

 image: [], 
 followers:[],
 following:[],
 numfollowers:'',
 numfollowing:'',
 currentUser: [],
 photos: null, 
 orgpicname: [],
 userpicname:[],
 eventc: '',
 userpic: [], 
 userimage: '',
 orgtext:'',
 rating:0,
 trating:0,
 orginfo: [], 

 cUsername:'',
 //cUserpic:'',
 followingright: '1%',
 anonymousright:10000,
 backgroundColor: 'dodgerblue',
 borderColor: 'dodgerblue',
 followings: false, 
 buttonMessage:'Follow',
 anonymousMessage:'',
 cUsername:'',
 cUserinfo:'',
 followrowid:'',
 //followingrowid:'',
 rand:'',
 total:{},
 is_updated:false,
 email: store.getState().email,
 password: store.getState().password, 
 identityid: store.getState().identityid,
 id:store.getState().id,
 username:store.getState().username, 
 cusername:store.getState().cusername,
 ausername: store.getState().ausername,
 causername:store.getState().causername,
 firstname: store.getState().firstname,
 lastname: store.getState().lastname, 
 incollege:store.getState().incollege, 
 collegename:store.getState().collegename, 
 userbio:store.getState().userbio,
 userpic:store.getState().userpic,
 auserbio:store.getState().auserbio,
 auserpic:store.getState().auserpic,
 major:store.getState().major,
 race:store.getState().race,
 gender:store.getState().gender,
 birthday:store.getState().birthday,
 country:store.getState().country,
 utype:store.getState().utype,
 orgname:store.getState().orgname,
 anonymous:store.getState().anonymous,


 sidentityid: store1.default.getState().identityid,
 sid:store1.default.getState().id,
 susername:store1.default.getState().username, 
 scusername:store1.default.getState().cusername,
 sausername: store1.default.getState().ausername,
 scausername:store1.default.getState().causername,
 sfirstname: store1.default.getState().firstname,
 slastname: store1.default.getState().lastname, 
 sincollege:store1.default.getState().incollege, 
 scollegename:store1.default.getState().collegename, 
 suserbio:store1.default.getState().userbio,
 suserpic:store1.default.getState().userpic,
 sauserbio:store1.default.getState().auserbio,
 sauserpic:store1.default.getState().auserpic,
 smajor:store1.default.getState().major,
 srace:store1.default.getState().race,
 sgender:store1.default.getState().gender,
 sbirthday:store1.default.getState().birthday,
 scountry:store1.default.getState().country,
 sutype:store1.default.getState().utype,
 sorgname:store1.default.getState().orgname,
 sanonymous:store1.default.getState().anonymous,
 
 bio:'',
 uname:'',
 first:'',
 last:'',
 pic:'',
 switch0:false,
 switch1:false,

 events: [],
 imagee: '',


 blogs: [], 
 images: '',
 blogHeight: 190,

 keyboardOffset: 0,

 //profile commmets 
  ccoment: '',
  postcomment: [],
  repliesquery: [],
  profilecomment: [],
  profilecomment1: [],
  repliescomment: [],
  commentprofileinfo: [],
  userimagecomment: '',
  replies0: [],
  

 followingss:store2.default.getState().followings,

 commentarray: [],
 commentarray1: [{ 
  key: '1',
  posterpic: 'http://interreligio.unistra.fr/wp-content/uploads/2017/07/profil-vide-300x300.png',
  postername: 'Devin Devlin0',
  pusername: '@DevinNA0',
  alllikes: '1',
  alldislikes: '0',
  cuserliked: 'cyan',
  cuserdisliked: 'red'
 }, 
 { 
  key: '2',
  posterpic: 'http://interreligio.unistra.fr/wp-content/uploads/2017/07/profil-vide-300x300.png',
  postername: 'Devin Devlin1',
  pusername: '@DevinNA1',
  alllikes: '1',
  alldislikes: '0',
  cuserliked: 'green',
  cuserdisliked: 'gray'
   },
   { 
    key: '3',
    posterpic: 'http://interreligio.unistra.fr/wp-content/uploads/2017/07/profil-vide-300x300.png',
    postername: 'Devin Devlin2',
    pusername: '@DevinNA2',
    alllikes: '1',
    alldislikes: '0',
    cuserliked: 'yellow',
    cuserdisliked: 'blue'
     },],
 

  activeIndex:0
 }
 store.subscribe(()=>{this.setState(store.getState())})
 store1.default.subscribe(()=>{this.setState(store1.default.getState())})
 }


 async componentDidMount() {
   this.setState({isFetching:true})
   console.log("App subscribe this.state:" + JSON.stringify(this.state));
   if(this.state.identityid==this.state.sidentityid)
   {
      if(this.state.sanonymous==true){
         await this.setState({
            anonymousMessage:'Anonymous',
         })
      } else {
         await this.setState({
            anonymousMessage:'Non-Anonymous', 
         })
      }
      await this.setState({
         followingright:10000,
         anonymousright:'1%'
      })
   }
   
   if(this.state.sanonymous==true){
      await this.setState({
         bio:this.state.sauserbio,
         uname:this.state.sausername,
         first:'HBN',
         last:'SAVAGE',
         pic:this.state.sauserpic,
      })
   } else {
      await this.setState({
         bio:this.state.suserbio,
         uname:this.state.susername,
         first:this.state.sfirstname,
         last:this.state.slastname,
         pic:this.state.suserpic,
      })
   }

  blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { identityid: { eq: this.state.sidentityid }, anonymous: {eq:String(this.state.sanonymous)} } } ))
  await this.setState({blogs:blogquery.data.listBlogs.items})
  console.log('this.state.blogs: ', this.state.blogs)
  if(this.state.sanonymous==true){
  for(let i=0;i<this.state.blogs.length; i++){
      this.state.blogs[i].posterpics = this.state.sauserpic
      this.state.blogs[i].posterpic = this.state.sausername
  }
} else {
   for(let i=0;i<this.state.blogs.length; i++){
      this.state.blogs[i].posterpics = this.state.suserpic
      this.state.blogs[i].posterpic = this.state.susername
  }
}


var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: { identityid: { eq: this.state.sidentityid }, anonymous: {eq:String(this.state.sanonymous)} } } ))
await this.setState({events:eventquery.data.listEvents.items})
console.log('this.state.events: ', this.state.events)
if(this.state.sanonymous==true){
for(let i=0;i<this.state.events.length; i++){
    this.state.events[i].posterpic = this.state.sauserpic
    this.state.events[i].posterpic = this.state.sausername
    this.state.events[i].postername='Ghost'
    this.state.events[i].pusername="@"+this.state.sausername
}
} else {
 for(let i=0;i<this.state.events.length; i++){
    this.state.events[i].posterpic = this.state.suserpic
    this.state.events[i].posterpic = this.state.susername
    this.state.events[i].postername=this.state.sfirstname+' '+this.state.slastname
    this.state.events[i].pusername="@"+this.state.susername
}
}

   await Promise.all([
      this.follow(),
      this.userpic(),
     // this.eventpics(),
      this.ratings(),


   //   this.postername(),
      this.userlikes(),
      this.alllikes(),
      this.eventpics(),
      this.posterpics(),

      this.userlikesb(),
      this.alllikesb(),

      this.profilecomments()
   ])
   this.setState({isFetching:false})
}

forceUpdateHandler(){
   this.componentDidMount();
   this.forceUpdate();
 };


 userlikes=async ()=> {
   for(let i=0;i<this.state.events.length; i++){
     var cuserlikesquery = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: {eid: { eq: this.state.events[i].eid },identityid:{eq:this.state.sidentityid},anonymous:{eq:String(this.state.sanonymous)} } } ))
     if(cuserlikesquery.data.listEventlikes.items.length>0){
         if(cuserlikesquery.data.listEventlikes.items[i].likes=='1')
         {
           this.state.events[i].cuserliked = 'cyan'
           this.state.events[i].cuserdisliked='grey'
         } else if(cuserlikesquery.data.listEventlikes.items[i].likes=='-1') {
           this.state.events[i].cuserliked = 'grey'
           this.state.events[i].cuserdisliked='cyan'
         } 
     } else {
         this.state.events[i].cuserliked = 'grey'
         this.state.events[i].cuserdisliked='grey'
     }
   }
   return Promise
 }



 alllikes=async()=>{
   for(let i=0;i<this.state.events.length; i++){
       this.state.events[i].alllikes = 0
       this.state.events[i].alldislikes=0
       var alllikesquery = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: {eid: { eq: this.state.events[i].eid } } } ))
       for(let k=0;k<alllikesquery.data.listEventlikes.items.length; k++){
         if(alllikesquery.data.listEventlikes.items[k].likes=='1'){
           this.state.events[i].alllikes =this.state.events[i].alllikes+1
         } else if(alllikesquery.data.listEventlikes.items[k].likes=='-1'){
           this.state.events[i].alldislikes =this.state.events[i].alldislikes+1
         }
       }
   }
   return Promise
 } 

 eventpics=async()=>{
   for(let i=0;i<this.state.events.length; i++){
   await Storage.get(this.state.events[i].epicpath, {level: 'protected',identityId:this.state.events[i].identityid})
                   .then(async data => {await this.setState({imagee: data})})
     this.state.events[i].eventpic=this.state.imagee
   }
   return Promise
 }

 posterpics=async()=>{
   for(let i=0;i<this.state.events.length; i++){
     var posterpic = await API.graphql(graphqlOperation(queries.listUserpics, { filter: {identityid:{eq:this.state.events[i].identityid} } } ))
     if(String(this.state.events[i].anonymous)=="true"){
       var pic = posterpic.data.listUserpics.items[0].auserpic  
     } else {
       var pic = posterpic.data.listUserpics.items[0].userpic 
     }
     await Storage.get(pic, {level: 'protected',identityId:this.state.events[i].identityid})
                   .then(async data => {await this.setState({image: data})})
     this.state.events[i].posterpic=this.state.image
   }
   return Promise
 }  



userlikesb= async() => {
for(let i=0;i<this.state.blogs.length; i++){
   var cuserlikesqueryb = await API.graphql(graphqlOperation(queries.listBloglikes, { filter: {bid: { eq: this.state.blogs[i].bid },identityid:{eq:this.state.sidentityid},anonymous:{eq:String(this.state.sanonymous)} } } ))
   //console.log('cuserlikesqueryb worked!')
   //console.log('cuserlikesqueryb: ', cuserlikesqueryb)
   if(cuserlikesqueryb.data.listBloglikes.items.length>0){
       //for(let k=0;k<cuserlikesqueryb.data.listBloglikes.items.length; k++) {
       if(cuserlikesqueryb.data.listBloglikes.items[0].likes=='1')
       {
           this.state.blogs[i].cuserliked = 'cyan'
           this.state.blogs[i].cuserdisliked='grey'
       } else if(cuserlikesqueryb.data.listBloglikes.items[0].likes=='-1') {
           this.state.blogs[i].cuserdisliked = 'cyan'
           this.state.blogs[i].cuserliked='grey'
       } else {
           this.state.blogs[i].cuserliked = 'grey'
           this.state.blogs[i].cuserdisliked='grey'
       }
   //}
   }
}
}

alllikesb= async()=> {
for(let i=0;i<this.state.blogs.length; i++){
   this.state.blogs[i].alllikes = 0
   this.state.blogs[i].alldislikes=0
   var alllikesqueryb = await API.graphql(graphqlOperation(queries.listBloglikes, { filter: {bid: { eq: this.state.blogs[i].bid } } } ))
   //console.log(alllikesquery)
for(let k=0;k<alllikesqueryb.data.listBloglikes.items.length; k++){
   if(alllikesqueryb.data.listBloglikes.items[k].likes=='1'){
       this.state.blogs[i].alllikes =this.state.blogs[i].alllikes+1
   } else if(alllikesqueryb.data.listBloglikes.items[k].likes=='-1'){
       this.state.blogs[i].alldislikes =this.state.blogs[i].alldislikes+1
   }
   //this.state.events[i].alllikes =Number(this.state.events[i].alllikes)+ Number(alllikesquery.data.listEventlikes.items[k].likes)
   }
}
}





async ratings(){
   var cratings = await API.graphql(graphqlOperation(queries.listProfileratingss, { filter: { ratedid: { eq: this.state.sidentityid },rateda:{eq:String(this.state.sanonymous)}} } ))
      //var total = Number(cratings.data.listProfileratingss.items.length)
      
      this.setState({total:Number(cratings.data.listProfileratingss.items.length)})
      console.log(cratings)
      for (var i = 0; i < cratings.data.listProfileratingss.items.length; i++) {
         await this.setState({smash:Number(this.state.smash)+Number(cratings.data.listProfileratingss.items[i].smash),
         heat:Number(this.state.heat)+Number(cratings.data.listProfileratingss.items[i].heat),
         looseness:Number(this.state.looseness)+Number(cratings.data.listProfileratingss.items[i].looseness),
         thickness:Number(this.state.thickness)+Number(cratings.data.listProfileratingss.items[i].thickness),
         intelligence:Number(this.state.intelligence)+Number(cratings.data.listProfileratingss.items[i].intelligence),
         savageness:Number(this.state.savageness)+Number(cratings.data.listProfileratingss.items[i].savageness),
         ratchetness:Number(this.state.ratchetness)+Number(cratings.data.listProfileratingss.items[i].ratchetness),
         diversity:Number(this.state.diversity)+Number(cratings.data.listProfileratingss.items[i].diversity)
         })
      }
      return Promise
}

async follow () {
   //var followers = await API.graphql(graphqlOperation(queries.listFollows, ))
//console.log(followers)
   var followers = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followingid: { eq: this.state.sidentityid },followinga:{eq:String(this.state.sanonymous)} } } ))
   //console.log('FOLLOWERS              '+followers.data.listFollows.items)
   
   var following = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followerid: { eq: this.state.sidentityid },followera:{eq:String(this.state.sanonymous)} } } ))
   //console.log('FOLLOWING              '+following.data.listFollows.items)
   //var cUserfollows = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: { eq: this.state.sidentityid },Followerid:{eq:this.state.identityid} } } ))
   var cUserfollows = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followingid: { eq: this.state.sidentityid },followinga:{eq:String(this.state.sanonymous)},followerid:{eq:this.state.identityid},followera:{eq:String(this.state.anonymous)} } } ))
   //var cUserfollowing = await API.graphql(graphqlOperation(queries.listFollowings, { filter: { followerid: { eq: this.state.identityid},followingid:{eq:this.state.sidentityid} } } ))
   //console.log(cUserfollowing)
   if(cUserfollows.data.listFollows.items.length>0){this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followrowid:cUserfollows.data.listFollows.items[0].id})}
   await this.setState({
      followers:followers,
      following:following,
      numfollowers:followers.data.listFollows.items.length-2,
      numfollowing:following.data.listFollows.items.length-2,

      }) 
      return Promise
}

async userpic(){
   await Storage.get(this.state.pic, {level: 'protected', identityId:this.state.sidentityid})
      .then(data => {
      this.setState({
      userimage: data
      })
    })
    .catch(err => {
      console.log("error fetching image", err)
    }) 
    return Promise
}

async eventpics(){
   var AllUserData = await API.graphql(graphqlOperation(queries.listEvents, { filter: { identityid: { eq: this.state.sidentityid },anonymous:{eq:String(this.state.sanonymous)} } } ))
   for(let i=0; i<AllUserData.data.listEvents.items.length; i++) {
      await this.setState({userpicname: [...this.state.userpicname, AllUserData.data.listEvents.items[i].epicpath.split('/').slice(-1)[0]]})
      }       
      for(let i=0; i<this.state.userpicname.length; i++) {
      await Storage.get(this.state.userpicname[i], {level: 'protected',identityId:this.state.sidentityid})
      .then(data => {
               this.setState({
               image: [...this.state.image, data]
               })
           })
        .catch(err => {
           console.log("error fetching image", err)
        })
      }
      return Promise
}

load = async() => {
    /*var credentials = await Auth.currentCredentials()
    console.log('crendentials: ',credentials)
    var identityIds = credentials.identityId
    console.log('identityIds: ', identityIds)
    if(identityIds != undefined) 
     {
       this.state.SignInOut = 1
     }*/
  }
  enableMessage() {
    this.setState({displayMessage: true});
  }
  completeso = () => {
    this.setState({SignInOut: 0});
    console.log('this.state.SignInOut:', this.state.SignInOut)
  }

   signOut = async() => {
      await Auth.signOut()
      .then(() => {
      {this.completeso()}
      })
      .catch(err => {
      console.log('err: ', err)
      })
}

postcomment = async() => {
  var postcomment = await API.graphql(graphqlOperation(queries.listProfilecomments ))
  var postnum = 0
  for(let i=0;i<postcomment.data.listProfilecomments.items.length; i++){
      if(Number(postcomment.data.listProfilecomments.items[i].cid.split('r')[0]) > postnum){
          postnum=Number(postcomment.data.listProfilecomments.items[i].cid.split('r')[0])
      } else {}
  }
  try{  await API.graphql(graphqlOperation(mutations.createProfilecomment, {input: {cid:(postnum+1), pidentityid: this.state.sidentityid, panonymous: this.state.sanonymous, identityid:this.state.identityid, anonymous: this.state.anonymous, ccomment: this.state.ccoment } }))
  console.log('successful posting comment')
  this.setState({ccoment:''})
} catch(err) {
  console.log('Did not successfully post comment', err)
}
}

replycomment = async(item) => {
   console.log('replycomment item: ', item)
   console.log('item: ', item+'r')
   var repliesquery = await API.graphql(graphqlOperation(queries.listProfilecomments, { filter: { cid: { beginsWith: item+'r' }} } ))
   console.log('repliesquery.data.listProfilecomments.items: ', repliesquery.data.listProfilecomments.items)
   if(repliesquery.data.listProfilecomments.items.length>0) {
   index=0
   for(let i=0;i<repliesquery.data.listProfilecomments.items.length; i++){
         var index = i;
   }
   console.log('index: ', index)
   try{ await API.graphql(graphqlOperation(mutations.createProfilecomment, {input: {cid:(item+'r'+(index+2)), pidentityid:this.state.sidentityid, panonymous: this.state.sanonymous, identityid: this.state.identityid, anonymous: this.state.anonymous, ccomment: this.state.ccoment} }))
  } catch(err){
    console.log('could not make reply: ', err)
  }
} else if(item.includes('r')){
} else {
  try { await API.graphql(graphqlOperation(mutations.createProfilecomment, {input: {cid:(item+'r'+1), pidentityid:this.state.sidentityid, panonymous: this.state.sanonymous, identityid: this.state.identityid, anonymous: this.state.anonymous, ccomment: this.state.ccoment} }))
} catch (err) {
  console.log('could not make new reply: ', err)
}
}
}

profilecomments = async() => {
  var profilecomment0 = await API.graphql(graphqlOperation(queries.listProfilecomments, { filter: { identityid: { eq: this.state.sidentityid }} } ))
  console.log('profilecomment.data.listProfilecomments.items: ', profilecomment0.data.listProfilecomments.items)
  this.setState({profilecomment:profilecomment0.data.listProfilecomments.items})
  console.log('this.state.profilecomment: ', this.state.profilecomment)
  for(let i=0;i<this.state.profilecomment.length; i++){
      if(this.state.profilecomment[i].cid.includes('r'))
      {
        
      } else {
        this.setState({profilecomment1:[...this.state.profilecomment1, this.state.profilecomment[i]]})
      }
  }

  for(let j=0;j<this.state.profilecomment1.length; j++){
    var profilecommentprofile = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { identityid: { eq: this.state.profilecomment1[j].identityid }} } ))
    console.log('profilecommentprofile: ',  profilecommentprofile.data.listUserinfos.items)
    this.setState({commentprofileinfo:profilecommentprofile.data.listUserinfos.items})
    console.log('this.state.profilecomment1[j].anonymous: ', this.state.profilecomment1[j].anonymous)
    if(this.state.profilecomment1[j].anonymous==String(false)) {
    this.state.profilecomment1[j].username = this.state.commentprofileinfo[0].username
    this.state.profilecomment1[j].fullname = this.state.commentprofileinfo[0].firstname+' '+this.state.commentprofileinfo[0].lastname
    await Storage.get(this.state.commentprofileinfo[0].userpic, {level: 'protected', identityId:this.state.commentprofileinfo[0].identityid})
      .then(data => {
      this.setState({
      userimagecomment: data
      })
    })
    .catch(err => {
      console.log("error fetching image", err)
    })
    this.state.profilecomment1[j].userpic =  this.state.userimagecomment
    } else {
      this.state.profilecomment1[j].username = this.state.commentprofileinfo[0].ausername
      this.state.profilecomment1[j].fullname = "Anonymous"
      await Storage.get(this.state.commentprofileinfo[0].auserpic, {level: 'protected', identityId:this.state.commentprofileinfo[0].identityid})
      .then(data => {
      this.setState({
      userimagecomment: data
      })
    })
    .catch(err => {
      console.log("error fetching image", err)
    })
    this.state.profilecomment1[j].userpic =  this.state.userimagecomment
    }

}

console.log('profilecomment1: ', this.state.profilecomment1)
}

/*
SeeComments = async() => {
   var commentquery = await API.graphql(graphqlOperation(queries.listcomments, { filter: { identityid: { eq: this.state.sidentityid }} } ))
   if(commentquery.data.listComments.items.length>0) {
      for(let i=0;i<repliesquery.data.listReply.items.length; i++){
            temp = repliesquery.data.listReply.items[i].cid
            var count = 0
            var count_1 = 0
         if(temp.includes('r')) {
            this.state.replies[count].replies = temp
            this.state.replies[count].identityid = repliesquery.data.listReply.items[i].identityid
            this.state.replies[count].cdetials = repliesquery.data.listReply.items[i].cdetails
            this.state.replies[count].anonymous = repliesquery.data.listReply.items[i].anonymous
            count = count + 1
         }
         this.state.comments[count_1].cid = temp
         this.state.comments[count_1].identityid = repliesquery.data.listReply.items[i].identityid
         this.state.comments[count_1].cdetials = repliesquery.data.listReply.items[i].cdetails
         this.state.comments[count_1].anonymous = repliesquery.data.listReply.items[i].anonymous
         count_1 = count_1 + 1
      }
} else {
   return 
}
}

SeeReplies = async(item) => {
   for(let i=0;i<this.state.replies.length; i++){
      count_2 = 0
      if(this.state.replies[i].inclues(item.cid+'r')) {
         this.state.repliesone
      } 
}
}
*/

seereplies = async(item) => {
  console.log('replycomment item: ', item)
  console.log('item: ', item+'r')
  var repliescomment = await API.graphql(graphqlOperation(queries.listProfilecomments, { filter: { cid:{beginsWith: item+'r'}  }})) 
  this.setState({replies0:repliescomment.data.listProfilecomments.items})
  console.log('thes.state.replies0: ', this.state.replies0)
  if(this.state.replies0.length>0) {
  for(let i=0;i<this.state.profilecomment1.length; i++){
    if(this.state.profilecomment1[i].cid == item) {
      this.state.profilecomment1[i].replies=[]
      for(let j=0;j<this.state.replies0.length; j++){
        this.state.profilecomment1[i].replies=this.state.profilecomment1[i].replies.concat(this.state.replies0[j])
      }
    } else {}
  }
} else {}
console.log('this.state.profilecomment1: ', this.state.profilecomment1)
console.log('this.state.profilecomment1[i]: ', this.state.profilecommentcomment1)
}



 
updateFollow = async() => {
        if(this.state.followings) { 
            var cUserfollows = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followingid: { eq: this.state.sidentityid },followinga: { eq: String(this.state.sanonymous) },followerid:{eq:this.state.identityid},followera:{eq:String(this.state.anonymous)} } } ))
            //var cUserfollowing = await API.graphql(graphqlOperation(queries.listFollowings, { filter: { followerid: { eq: this.state.identityid},followingid:{eq:this.state.sidentityid} } } ))
            this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollows.items[0].id})
            
            //await API.graphql(graphqlOperation(mutations.deleteFollowing, {input: {Followerid:this.state.identityid, Followingid:this.state.orginfo.identityId,Followingname:this.state.orginfo.orgName,Followingppic:this.state.orginfo.OrgPicture} }))
            //await API.graphql(graphqlOperation(mutations.deleteFollower, {input: {Followingid:this.state.orginfo.identityId, Followerid:this.state.identityid,Followername:this.state.cUsername,Followerppic:this.state.cUserpic} }))
            //console.log(this.state.followingrowid)
            await API.graphql(graphqlOperation(mutations.deleteFollow, {input: {id:this.state.followerrowid} }))
            //await API.graphql(graphqlOperation(mutations.deleteFollower, {input: {id:this.state.followerrowid} }))
            var followers = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followingid: { eq: this.state.sidentityid } ,followinga: { eq: String(this.state.sanonymous) }} } ))
            var following = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followerid: { eq: this.state.sidentityid },followera: { eq: String(this.state.sanonymous) } } } ))
            
            /*this.setState({
            followers:followers,
            following:following})*/
            this.setState((prevState, props) => {
            return {
            backgroundColor: 'dodgerblue',
            borderColor: 'dodgerblue',
            numfollowers:followers.data.listFollows.items.length-2,
            numfollowing:following.data.listFollows.items.length-2,

            followings: false,
            buttonMessage: 'Follow',
            
            
            };
            });
        } else {
            await API.graphql(graphqlOperation(mutations.createFollow, {input: {followerid:this.state.identityid, followingid:this.state.sidentityid,followinga:String(this.state.sanonymous),followera:String(this.state.anonymous)} }))
            //await API.graphql(graphqlOperation(mutations.createFollower, {input: {followingid:this.state.sidentityid, followerid:this.state.identityid,followername:this.state.cUsername,followerppic:this.state.cUserpic} }))
            var followers = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followingid: { eq: this.state.sidentityid } ,followinga: { eq: String(this.state.sanonymous) }} } ))
            var following = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followerid: { eq: this.state.sidentityid },followera: { eq: String(this.state.sanonymous) } } } ))
            
            /*this.setState({
            followers:followers,
            following:following})*/

            this.setState((prevState,props) => {
            return { 
            
            backgroundColor: 'black',
            borderColor: 'gray',
            numfollowers:followers.data.listFollows.items.length-2,
            numfollowing:following.data.listFollows.items.length-2,

            followings: true,
            buttonMessage: 'Following',
            
            };
            });
        }
          var following = await API.graphql(graphqlOperation(queries.listFollows, { filter: { followerid: { eq: this.state.identityid},followera:{eq:String(this.state.anonymous)}} } ))
          var l = [ {eida:{eq:'XXX'}} , {eida:{eq:'XXXX'}} ]
          var m = [ {bida:{eq:'XXX'}} , {bida:{eq:'XXXX'}} ]
          if(following.data.listFollows.items.length>0){
            for(let k=0;k<following.data.listFollows.items.length; k++){
              l[k]={eida:{eq:(following.data.listFollows.items[k].followingid+following.data.listFollows.items[k].followinga)}}
               m[k]={bida:{eq:(following.data.listFollows.items[k].followingid+following.data.listFollows.items[k].followinga)}}
            }
          }
          await store2.default.dispatch({ type: "follow",
                            payload: {following:following.data.listFollows.items,
                                      followings:l,
                                      followingsb:m
                                       } }); 
 }
 

 FlatListItemSeparator = () => {
    return (
    //Item Separator
    <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
    );
 };

 segmentClicked = (index) => {
    this.setState({
    activeIndex: index
    })
 }

 // onPress={() => this.props.navigation.push('EventClick', { picpath: item })} >

 renderSectionZero = () => {
        //console.log('images render: ', this.state.image) 
        return(
        <View style={{flex: 1, marginBottom: 325, marginVertical: 20}}> 
       <FlatList 
    data={this.state.events}
    //data={this.state.image}
    extraData={this.state.switch0}
    numColumns = {this.state.numColumnss}
    key={this.state.numColumnss}
    onRefresh={() => this.forceUpdateHandler()}
          refreshing={this.state.isFetching}
    renderItem={ ({ item }) => (
    <View style = {{flex:1, width: 100 + "%", backgroundColor:'black', height: '100%'}}> 
    
    <View style = {{ width:  "100%",height: 200, backgroundColor: 'black', 
                     justifyContent: "center",borderColor: "gray",borderWidth:1}}> 
    
    
    <TouchableOpacity style={{position:'absolute',top:'0%',left:'0%',}} onPress={() => this.props.navigation.push('UserProfile') }> 
    <Image style = {{height: 60,
 width: 60,
 borderRadius: 30,
 borderColor: 'white',
 borderWidth: 1,
 top: 10,
 resizeMode: 'contain',position:'absolute',top:'0%',left:'0%'}} 
    source = {{uri: item.posterpic}}/>
    {/*source = {{uri: item}}/>
    
    source = {{uri: "https://www.nsbe.org/NSBE/media/Images/About%20NSBE/Torch%20Symbol/PNG/NSBELogo_Black_withName.png"}}/>*/}

    </TouchableOpacity>

    
    

    <TouchableOpacity style={{position:'absolute',top:'0%',left:'15%'}} onPress={() => this.props.navigation.push('UserProfile')} >
    <Text style = {{ marginLeft: 10,color: 'white',fontSize: 20,fontWeight: '500',}}>
      {item.postername} 
    </Text>
    </TouchableOpacity>

    <TouchableOpacity style={{position:'absolute',top:'12%',left:'17%'}} onPress={() => this.props.navigation.push('UserProfile')}>
    <Text style = {{ color: 'cyan',fontSize: 16,}}>{item.pusername} </Text>
    </TouchableOpacity>

    <Text style = {{position:'absolute',top:'20%',left:'30%',color: "gray",fontSize: 13}}> {item.etime+" "+item.elocation} </Text>
    
 

  
    <TouchableOpacity style = {{position: "absolute",top: '5%',right: '0%',}}onPress={() => this.props.navigation.push('EventClick')} >
      <Text 

      style = {{marginLeft: 10, fontWeight: '200', color: "white", fontSize: 15, position: "absolute", top: 0}}>
      {item.ename}
      </Text>
      <Text style = {{marginTop:20,color: 'gray'}}> {item.edetails} </Text>
    </TouchableOpacity>
    

    
    

   

    <TouchableOpacity style={{position:'absolute',height: '50%',width: '100%',top:'31%',borderTopColor:'grey',borderTopWidth:1}} onPress={() => this.props.navigation.push('EventClick')}> 
    <Image 
    source = {{uri: item.eventpic}}
    //source = {{uri: item}}

    style = {{ width: '100%', height:'100%',resizeMode:'contain'}}/>
    </TouchableOpacity>

    <Text style = {{position: "absolute",left: '45%',top:'2%',color: "gray",fontSize: 14}}> {item.rating} </Text>

<Image style = {{
 position: "absolute",
 right: 40}} /> 


    <View style = {{ height: 60,
 width: 100 + "%",
 flexDirection: 'row',
 alignItems: 'flex-start',
 borderBottomWidth: 1,
 borderColor: "gray",
 top: 30}}>
    

    

    <TouchableOpacity onPress ={ async() => { 
      var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.sidentityid},anonymous:{eq:String(this.state.sanonymous)} } } ))

      //console.log(item)
      //console.log(this.state.events)
      for(let i=0;i<this.state.events.length; i++){
        if(this.state.events[i].eid==item.eid){
          var index = i
          break
        }
      }
      console.log(index)
      if(item.cuserliked=='cyan'){

      } else {
        if(item.cuserdisliked=='cyan'){
          //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.identityid} } } ))
          //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
          this.state.events[index].alllikes=this.state.events[index].alllikes+1
          this.state.events[index].alldislikes=this.state.events[index].alldislikes-1
          this.state.events[index].cuserdisliked='grey'
          this.state.events[index].cuserliked='cyan'
          this.setState({switch1:!this.state.switch1})
          await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "1"} }))
        } else {
          this.state.events[index].alllikes=this.state.events[index].alllikes+1
          this.state.events[index].cuserdisliked='grey'
          this.state.events[index].cuserliked='cyan'
          this.setState({switch1:!this.state.switch1})
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous), likes: "1"} }))
        }
      }
      //this.onRefresh()
      //this.state.isFetching='true'
      //this.state.isFetching='false'
      //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)

    }}>
    
    <FontAwesome style = {{marginLeft: 15,color: item.cuserliked}} name = "thumbs-o-up" size={20} />

    </TouchableOpacity>

    
    <Text style = {{color: 'gray'}}> {item.alllikes} </Text>
    



    

    

    <TouchableOpacity onPress ={async() => { 
      //console.log(item)
      var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.sidentityid} ,anonymous:{eq:String(this.state.sanonymous)}} } ))
      //if(cevent.data.listEventlikes.items.length<1){
        for(let i=0;i<this.state.events.length; i++){
          if(this.state.events[i].eid==item.eid){
            var index = i
            break
          }
        }
      //}
      if(item.cuserdisliked=='cyan'){

      } else {
        if(item.cuserliked=='cyan'){
          //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.identityid} } } ))
          //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
          this.state.events[index].alllikes=this.state.events[index].alllikes-1
          this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
          this.state.events[index].cuserliked='grey'
          this.state.events[index].cuserdisliked='cyan'
          this.setState({switch0:!this.state.switch0})
          await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "-1"} }))        
        } else {
          this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
          this.state.events[index].cuserliked='grey'
          this.state.events[index].cuserdisliked='cyan'
          this.setState({switch0:!this.state.switch0})
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "-1"} }))
        }
      }
      //this.onRefresh()
      //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)
    }}>

    <FontAwesome style = {{marginLeft: 50,color:item.cuserdisliked}} name = "thumbs-o-down" size={20} />

    </TouchableOpacity>

    

    <Text style = {{color: 'gray'}}> {item.alldislikes} </Text>

    
    <TouchableOpacity>
    
    <FontAwesome style = {{ marginLeft: 50,
 color: "gray"}} name = "comment-o" size={20} />

    </TouchableOpacity>

    <TouchableOpacity>

    <Text style = {{color: 'gray'}}> {this.state.comments} </Text>

    </TouchableOpacity>



    </View>
    </View>

    </View>
    )
    } 
keyExtractor={(items, index, numColumns) => index.toString()} />
        </View>
        )
 
 }

 renderSectionOne = () => {

   const animatedHeight = {
      height: this.state.blogHeight
      }

    return (
        <View style={{flex: 1, marginBottom: 325}}> 
      <FlatList 
      extraData={this.state.switch1}
      data={this.state.blogs}
      numColumns = {this.state.numColumnss}
      key={this.state.numColumnss}
      onRefresh={() => this.forceUpdateHandler()}
      refreshing={this.state.isFetching}
      renderItem={ ({ item }) => (


 <View style = {{flex:1, width: 100 + "%", backgroundColor:'black'}}> 
 {/*console.log('this.state.blogs: ', this.state.blogs)*/}
 <View style = {{ width: 100 + "%",
 height: 200,
 backgroundColor: 'black',
 flexDirection: "row",
 borderBottomWidth: 0.4,
 borderColor: 'transparent',
 top: 17,}, animatedHeight}> 
 
 <View style = {{ 
 position: 'absolute',
 height: 95 ,
 width: '100%' ,
 marginTop: 5,
 backgroundColor: 'black',
 justifyContent:'center',
 flex: 1,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center', }}> 
 
 <View style ={{ backgroundColor: 'black',
 height:20,
 width: 20,
 position:'absolute',
 left: 5,
 top:15,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'}}>
 <FontAwesome style ={{color:'cyan',
 position:'absolute',
 left:2,
 top: -15}} name = "user-secret" size={20}/> 
 </View>
 
 <View style = {{ 
 backgroundColor: 'black',
 height: 20,
 width:100,
 position: 'absolute',
 top:0,
 left:28,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'}}>
 
 <Text style ={{fontSize: 13,
 color: 'gray',
 top:2,
 left: -3}}>

 {item.posterpic}
 </Text>
 
 </View> 

 <View style={{ backgroundColor: 'black',
 height:30,
 width:80,
 position:'absolute',
 top: 0,
 right: 0,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'}}>

 <Text style ={{ fontSize:11,
 color:'gray',
 top: 3}}>
 5 hours ago
 </Text>
 
 </View>

 <View style = {{ position: 'absolute',
 top: 20,
 height: 50,
 width: 250,
 flexDirection:'row',
 left: 80,
 backgroundColor: 'black',
 justifyContent:'center',
 flex: 1,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'}}> 
 
 <Text style = {{ color: 'white',
 fontSize: 20,
 fontWeight:'700',
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center',
 justifyContent: 'center',
 top:-10}} >{item.bname} </Text> 
 
 </View>

 <View style={{borderColor:'transparent', borderWidth: 1, height: 0, width: 425 ,
 top: 247, left:0 }}>
 
 </View>

 <View style = {{position: 'absolute',
 top: 40,
 height: 100,
 width: 300,
 flexDirection:'row'}}>
 
 </View>

 </View>

 <View style = {{ height: 220, width: 100+'%', top: 60, marginBottom: 10,borderColor: 'transparent',
borderWidth:0.5
}}> 

 {/*<Animated.View style={[styles.description, animatedStyle]}>*/}
 
 <Text style={{color:'white'}}>
 {item.bdetails}
 
 </Text>
 <TouchableOpacity onPress = {this.toggleAnimation}>
 <Text style={{color:'gray'}}>{this.state.text}
 </Text> 
 </TouchableOpacity>
 {/*</Animated.View>*/}
 
 </View>

 </View>

 <View style = {{
 height: 50,
 width: 100 + "%",
 flexDirection: 'row',
 alignItems: 'flex-start',
 borderBottomWidth: 1,
 borderColor: "gray",
 top:0}}>
 
 <TouchableOpacity onPress ={async() => { 
    var blogpostlike = await API.graphql(graphqlOperation(queries.listBloglikes, { filter: { bid: { eq: item.bid},identityid:{eq:this.state.identityid} ,anonymous:{eq:String(this.state.anonymous)}} } ))

        //console.log(item)
        //console.log(this.state.events)
    for(let i=0;i<this.state.blogs.length; i++){
        if(this.state.blogs[i].bid==item.bid){
            var index = i
            break
            }
        }
        console.log('index: ', index)
        if(item.cuserliked=='cyan'){
        } else {
            if(item.cuserdisliked=='cyan'){
            //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.IDENTITYID} } } ))
            //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
            this.state.blogs[index].alllikes=this.state.blogs[index].alllikes+1
            this.state.blogs[index].alldislikes=this.state.blogs[index].alldislikes-1
            this.state.blogs[index].cuserdisliked='grey'
            this.state.blogs[index].cuserliked='cyan'
            this.setState({switch1:!this.state.switch1})
            await API.graphql(graphqlOperation(mutations.deleteBloglike, {input: {id:blogpostlike.data.listBloglikes.items[0].id} }))
            await API.graphql(graphqlOperation(mutations.createBloglike, {input: {bid:item.blogid, identityid:this.state.identityid, anonymous:String(this.state.anonymous), likes: "1"} }))
            } else {
            this.state.blogs[index].alllikes=this.state.blogs[index].alllikes+1
            this.state.blogs[index].cuserdisliked='grey'
            this.state.blogs[index].cuserliked='cyan'
            this.setState({switch1:!this.state.switch1})
            await API.graphql(graphqlOperation(mutations.createBloglike, {input: {bid:item.bid, identityid:this.state.identityid, anonymous:String(this.state.anonymous), likes: "1"} }))
            }
        }
 // console.log(this.state.blogs[index].cuserliked," disliked: ",this.state.blogs[index].cuserdisliked)

}}>
 <FontAwesome style = {{ marginLeft: 20, color:item.cuserliked, top: 23, left:12}} name = "thumbs-o-up" size={20} />
 
 </TouchableOpacity>

 <Text style = {{color: 'gray',top:24,left:14}}> {item.alllikes} </Text>
 

 <TouchableOpacity onPress ={async() => { 
    var blogpostlike = await API.graphql(graphqlOperation(queries.listBloglikes, { filter: { bid: { eq: item.bid},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))

    //console.log(item)
    //console.log(this.state.events)
    for(let i=0;i<this.state.blogs.length; i++){
        if(this.state.blogs[i].bid==item.bid){
        var index = i
        break
        }
    }

    if(item.cuserdisliked=='cyan'){
    } else {
    if(item.cuserliked=='cyan'){
    //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.IDENTITYID} } } ))
    //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
    this.state.blogs[index].alllikes=this.state.blogs[index].alllikes-1
    this.state.blogs[index].alldislikes=this.state.blogs[index].alldislikes+1
    this.state.blogs[index].cuserliked='grey'
    this.state.blogs[index].cuserdisliked='cyan'
    this.setState({switch1:!this.state.switch1})
    await API.graphql(graphqlOperation(mutations.deleteBloglike, {input: {id:blogpostlike.data.listBloglikes.items[0].id} }))
    await API.graphql(graphqlOperation(mutations.createBloglike, {input: {bid:item.bid, identityid:this.state.identityid,anonymous:String(this.state.anonymous), likes: '-1'} }))
    } else {
    this.state.blogs[index].alldislikes=this.state.blogs[index].alldislikes+1
    this.state.blogs[index].cuserliked='grey'
    this.state.blogs[index].cuserdisliked='cyan'
    this.setState({switch1:!this.state.switch1})
    await API.graphql(graphqlOperation(mutations.createBloglike, {input: {bid:item.bid, identityid:this.state.identityid,anonymous:String(this.state.anonymous), likes: '-1'} }))
    }
    }
// console.log(this.state.blobea[index].cuserliked," disliked: ",this.state.blobea[index].cuserdisliked)

}} >

 <FontAwesome style = {{marginLeft: 100, top: 22, left:-50, color:item.cuserdisliked}} name = "thumbs-o-down" size={20} />

 </TouchableOpacity>

 <Text style = {{color: 'grey',left:-48,top:24}}> {item.alldislikes} </Text>
 
 <TouchableOpacity onPress = {this.commentpress}>
 <FontAwesome style = {{ marginLeft: 100,
 color: "gray",
 top: 22,
 left: -55}} name = "comment-o" size={20} />
 </TouchableOpacity>
 
 <TouchableOpacity onPress = {this.sharepress}>
 <FontAwesome style ={{top:23,left:8,color:'gray'}}name = "share-square-o" size={20}/>
 </TouchableOpacity>
 
 <Text style = {{top:24,left:13,color: 'gray'}}> 
 Share
 </Text>
 
 <Text style = {{color: 'gray', top: 24, left: -110}}> {this.state.comments} </Text> 
 
</View>
<View>
 
</View>
<View style = {{top:29, position: 'relative'}}>

</View>

</View>
)
} 
keyExtractor={(items, index, numColumns) => index.toString()} />
        
        </View> 

        ) 
        
}

renderSectionTwo = () => {
    return (
    <View style = {{flex:1, width:100 + "%", height: 100 + "%", backgroundColor:'black', paddingBottom: 330}}>
    <OrgRatingFeed />
    </View>
    )
}

onChange = (key, value) => {
  this.setState({ [key]: value })
  }

renderSectionThree = () => {
 
    return(
      
      <View style={{flex: 1, marginBottom: 0, marginVertical: 20}}> 
      <View style = {{flexDirection: 'row', height: 10, top: '-10%', borderColor: 'white'}}> 
           <TouchableOpacity>
           <Image style = {{left: 10, height: 40, width: 40, borderRadius: 20}} source = {{uri: 'https://live.staticflickr.com/1279/4703365225_8c898c7530_b.jpg'}}/>
           </TouchableOpacity>
           
          <TextInput 
          placeholder = 'Add a comment...'
          placeholderTextColor='white'
          style = {{ paddingLeft: 15, color: 'white', width: 330, height: 40, left: 25, borderRadius: 20, borderColor: 'dimgray', backgroundColor: 'transparent', borderWidth: 1}}
        onChangeText={v => {
       this.setState({ccoment: v})
       }}
       value={this.state.ccoment}
> </TextInput>
          <TouchableOpacity onPress={this.postcomment}> 
          <Text style = {{left: -28, top: 10, color: 'dodgerblue', position: 'absolute'}}> Post </Text>
          </TouchableOpacity>

           </View>

 <FlatList 
   data={this.state.profilecomment1}
   //data={this.state.image}
   extraData={this.state.switch0}
  // numColumns = {this.state.numColumnss}
  // key={this.state.numColumnss}
   onRefresh={() => this.forceUpdateHandler()}
   refreshing={this.state.isFetching}
   renderItem={ ({ item }) => (
   <View style = {{flex:1, width: '100%', backgroundColor:'black', height: '100%', marginBottom: '-25%'}}> 
   
   <View style = {{ width:  "100%",height: 200, backgroundColor: 'black', 
                    justifyContent: "center"}}> 
   
   
   <TouchableOpacity style={{position:'absolute',top:'0%',left:'0%',}} onPress={() => this.props.navigation.push('UserProfile') }> 
   <Image style = {{height: 40,
        width: 40,
        borderRadius: 30,
        borderColor: 'white',
        borderWidth: 1,
        top: '0%',
        resizeMode: 'contain',left:'0%'}} 
   source = {{uri: item.userpic}}/>
   {/*source = {{uri: item}}/>
   
   source = {{uri: "https://www.nsbe.org/NSBE/media/Images/About%20NSBE/Torch%20Symbol/PNG/NSBELogo_Black_withName.png"}}/>*/}

   </TouchableOpacity>

   
   

   <TouchableOpacity style={{position:'absolute',top:'0%',left:'12%'}} onPress={() => this.props.navigation.push('UserProfile')} >
   <Text style = {{ marginLeft: '0%',color: 'cyan',fontSize: 20,fontWeight: '500',}}>
     {('@'+item.username)} 
   </Text>
   </TouchableOpacity>

   <TouchableOpacity style={{position:'absolute',top:'12%',left:'12%'}} onPress={() => this.props.navigation.push('UserProfile')}>
   <Text style = {{ color: 'gray',fontSize: 16,}}>{item.ccomment} </Text>
   </TouchableOpacity>




   <View style = {{ height: 60,
width: 100 + "%",
flexDirection: 'row',
alignItems: 'flex-start',
top: 30}}>
  

   

   <TouchableOpacity onPress ={ async() => { 
     var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.sidentityid},anonymous:{eq:String(this.state.sanonymous)} } } ))

     //console.log(item)
     //console.log(this.state.events)
     for(let i=0;i<this.state.events.length; i++){
       if(this.state.events[i].eid==item.eid){
         var index = i
         break
       }
     }
     console.log(index)
     if(item.cuserliked=='cyan'){

     } else {
       if(item.cuserdisliked=='cyan'){
         //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.identityid} } } ))
         //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
         this.state.events[index].alllikes=this.state.events[index].alllikes+1
         this.state.events[index].alldislikes=this.state.events[index].alldislikes-1
         this.state.events[index].cuserdisliked='grey'
         this.state.events[index].cuserliked='cyan'
         this.setState({switch1:!this.state.switch1})
         await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
         await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "1"} }))
       } else {
         this.state.events[index].alllikes=this.state.events[index].alllikes+1
         this.state.events[index].cuserdisliked='grey'
         this.state.events[index].cuserliked='cyan'
         this.setState({switch1:!this.state.switch1})
         await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous), likes: "1"} }))
       }
     }
     //this.onRefresh()
     //this.state.isFetching='true'
     //this.state.isFetching='false'
     //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)

   }}>
   
   <FontAwesome style = {{ marginTop: '-150%', marginLeft: 15,color: "cyan"}} name = "thumbs-o-up" size={20} />

   </TouchableOpacity>

   
   <Text style = {{color: 'gray', marginTop: '-11%'}}> 1 </Text>
   



   

   

   <TouchableOpacity onPress ={async() => { 
     //console.log(item)
     var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.sidentityid} ,anonymous:{eq:String(this.state.sanonymous)}} } ))
     //if(cevent.data.listEventlikes.items.length<1){
       for(let i=0;i<this.state.events.length; i++){
         if(this.state.events[i].eid==item.eid){
           var index = i
           break
         }
       }
     //}
     if(item.cuserdisliked=='cyan'){

     } else {
       if(item.cuserliked=='cyan'){
         //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.identityid} } } ))
         //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
         this.state.events[index].alllikes=this.state.events[index].alllikes-1
         this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
         this.state.events[index].cuserliked='grey'
         this.state.events[index].cuserdisliked='cyan'
         this.setState({switch0:!this.state.switch0})
         await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
         await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "-1"} }))        
       } else {
         this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
         this.state.events[index].cuserliked='grey'
         this.state.events[index].cuserdisliked='cyan'
         this.setState({switch0:!this.state.switch0})
         await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "-1"} }))
       }
     }
     //this.onRefresh()
     //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)
   }}>

   <FontAwesome style = {{marginTop: '-170%', marginLeft: 10,color:"gray"}} name = "thumbs-o-down" size={20} />

   </TouchableOpacity>

   

   <Text style = {{color: 'gray', marginTop: '-11%'}}> 1 </Text>

   
   <TouchableOpacity onPress={() => this.replycomment(item.cid)}>

   <Text style = {{color: 'gray', marginTop: '-70%', marginLeft: 20, fontSize: 15}}> Reply </Text>

   </TouchableOpacity>

   <TouchableOpacity onPress={() => this.seereplies(item.cid)}>

   <Text style = {{color: 'gray', marginTop: '-25%', marginLeft: 60}}> View Replies (2) </Text>

   </TouchableOpacity>
   <View style={{height: 600}}>
   <FlatList 
   style={{marginTop: '2%', marginLeft: '-15%', width:'100%', height: '20%'}}
   data={item.replies}
   //data={this.state.image}
  // extraData={1,2,3,4}
  // numColumns = {this.state.numColumnss}
 //  key={this.state.numColumnss}
   onRefresh={() => this.forceUpdateHandler()}
   refreshing={this.state.isFetching}
   renderItem={ ({ item }) => (
  <View style = {{ width: 100 + "%", backgroundColor:'black', height: '100%', marginRight: '300%', paddingBottom: '0%'}}> 
   
  <View style = {{ width:  "100%",height: 300, backgroundColor: 'black', 
                   justifyContent: "center",  }}> 
  
  
  <TouchableOpacity style={{position:'absolute',top:'0%',left:'0%',right: '50%'}} onPress={() => this.props.navigation.push('UserProfile') }> 
  <Image style = {{height: 40,
width: 40,
borderRadius: 30,
borderColor: 'white',
borderWidth: 1,
top: 10,
resizeMode: 'contain',position:'absolute',top:'0%',left:'0%'}} 
  source = {{uri: item.userpic}}/>
  {/*source = {{uri: item}}/>
  
  source = {{uri: "https://www.nsbe.org/NSBE/media/Images/About%20NSBE/Torch%20Symbol/PNG/NSBELogo_Black_withName.png"}}/>*/}

  </TouchableOpacity>

  
  

  <TouchableOpacity style={{position:'absolute',top:'0%',left:'3%'}} onPress={() => this.props.navigation.push('UserProfile')} >
  <Text style = {{ marginLeft: 10,color: 'white',fontSize: 20,fontWeight: '500',}}>
    {item.postername}
  </Text>
  </TouchableOpacity>

  <TouchableOpacity style={{position:'absolute',top:'8%',left:'3.5%'}} onPress={() => this.props.navigation.push('UserProfile')}>
<Text style = {{ color: 'cyan',fontSize: 16,}}>{item.username}</Text>
  </TouchableOpacity>



  <Text style={{marginLeft: 50, color: 'white', marginBottom: '8%'}}> {item.ccomment} </Text>

  <View style = {{ height: 60,
width: 100 + "%",
flexDirection: 'row',
alignItems: 'flex-start',
top: 0}}>
 

  

  <TouchableOpacity onPress ={ async() => { 
    var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.sidentityid},anonymous:{eq:String(this.state.sanonymous)} } } ))

    //console.log(item)
    //console.log(this.state.events)
    for(let i=0;i<this.state.events.length; i++){
      if(this.state.events[i].eid==item.eid){
        var index = i
        break
      }
    }
    console.log(index)
    if(item.cuserliked=='cyan'){

    } else {
      if(item.cuserdisliked=='cyan'){
        //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.identityid} } } ))
        //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
        this.state.events[index].alllikes=this.state.events[index].alllikes+1
        this.state.events[index].alldislikes=this.state.events[index].alldislikes-1
        this.state.events[index].cuserdisliked='grey'
        this.state.events[index].cuserliked='cyan'
        this.setState({switch1:!this.state.switch1})
        await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
        await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "1"} }))
      } else {
        this.state.events[index].alllikes=this.state.events[index].alllikes+1
        this.state.events[index].cuserdisliked='grey'
        this.state.events[index].cuserliked='cyan'
        this.setState({switch1:!this.state.switch1})
        await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous), likes: "1"} }))
      }
    }
    //this.onRefresh()
    //this.state.isFetching='true'
    //this.state.isFetching='false'
    //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)

  }}>
  
  <FontAwesome style = {{ top: '-200%', marginLeft: 55,color: item.cuserliked}} name = "thumbs-o-up" size={20} />

  </TouchableOpacity>

  
<Text style = {{color: 'gray', top: '-40%'}}>{item.alllikes}</Text>
  



  

  

  <TouchableOpacity onPress ={async() => { 
    //console.log(item)
    var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.sidentityid} ,anonymous:{eq:String(this.state.sanonymous)}} } ))
    //if(cevent.data.listEventlikes.items.length<1){
      for(let i=0;i<this.state.events.length; i++){
        if(this.state.events[i].eid==item.eid){
          var index = i
          break
        }
      }
    //}
    if(item.cuserdisliked=='cyan'){

    } else {
      if(item.cuserliked=='cyan'){
        //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: item.eventid},identityId:{eq:this.state.identityid} } } ))
        //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
        this.state.events[index].alllikes=this.state.events[index].alllikes-1
        this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
        this.state.events[index].cuserliked='grey'
        this.state.events[index].cuserdisliked='cyan'
        this.setState({switch0:!this.state.switch0})
        await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
        await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "-1"} }))        
      } else {
        this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
        this.state.events[index].cuserliked='grey'
        this.state.events[index].cuserdisliked='cyan'
        this.setState({switch0:!this.state.switch0})
        await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.sidentityid, anonymous:String(this.state.sanonymous),likes: "-1"} }))
      }
    }
    //this.onRefresh()
    //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)
  }}>

  <FontAwesome style = {{top: '-200%', marginLeft: 40,color:item.cuserdisliked}} name = "thumbs-o-down" size={20} />

  </TouchableOpacity>

  

  <Text style = {{color: 'gray', marginTop: '-40%'}}> {item.alldislikes} </Text>


  </View>
  </View>
   </View>

)}
keyExtractor={(items, index, numColumns) => index.toString()} >

</FlatList>
</View>



   </View>
   </View>

   </View>
  )}
  keyExtractor={(items, index, numColumns) => index.toString()} >
                    
  </FlatList>
</View>
    )
}

 renderSection = () => {
    if(this.state.activeIndex == 0) {
    return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    {this.renderSectionZero()}
    </View>
    )
    }
    if(this.state.activeIndex == 1) {
    return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    {this.renderSectionOne()}
    </View>
    )
    }
    if(this.state.activeIndex == 2) {
    return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    {this.renderSectionTwo()}
    </View>
    )
    }
    if(this.state.activeIndex == 3) {
    return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    {this.renderSectionThree()}
    </View>
    )
    }
 }


 
 render()
 
 
 { 
   
    const {displayMessage} = this.state;
    if (this.state.isFetching) {
      return <View style={{
        width: '100%',
        height: '100%',
        backgroundColor:'black'
      }}><ActivityIndicator color= 'cyan' size='large' style={{marginTop:250,bottom:'0%'}} /></View>;
    }
    /*if (!displayMessage) {
      return <View style={{height:'100%',width:'100%',backgroundColor:'black'}}></View>;
    }*/
 return (
 <Container style={{flex: 1, backgroundColor: "black"}}> 
 <TouchableOpacity style={{zIndex:2,backgroundColor:'white',position:'absolute', width:'30%',height:'30%',top:'96%', right:'-12%'}} onPress={async() => {await Auth.signOut()
        .then(() => {})
        await store.dispatch({ type: "signin",
        payload: {id:'NA',
                   identityid:'NA',
                   cusername:'NA',
                   causername:'NA',
                   username:'NA',
                   userbio:'NA',
                   userpic:'NA',
                   ausername:'NA',
                   auserbio:'NA',
                   auserpic:'NA',
                   firstname:'NA',
                   lastname:'NA',
                   collegename:'NA',
                   incollege:'NA',
                   major:'NA',
                   race:'NA',
                   gender:'NA',
                   birthday:'NA',
                   country:'NA',
                   utype:'NA',
                   orgname:'NA',
                   email: "NA",
                   password: "NA",
                anonymous:false } });

await store1.default.dispatch({ type: "navigate",
                payload: {id:'NA',
                           identityid:'NA',
                           cusername:'NA',
                           causername:'NA',
                           username:'NA',
                           userbio:'NA',
                           userpic:'NA',
                           ausername:'NA',
                           auserbio:'NA',
                           auserpic:'NA',
                           firstname:'NA',
                           lastname:'NA',
                           collegename:'NA',
                           incollege:'NA',
                           major:'NA',
                           race:'NA',
                           gender:'NA',
                           birthday:'NA',
                           country:'NA',
                           utype:'NA',
                           orgname:'NA',
                           email: "NA",
                           password: "NA",
                        anonymous:false } });
                        this.props.navigation.push('LogIn')
        .catch(err => {
        console.log('err: ', err)
        })
       
       }}>
           <Text style={{}}>Signout</Text>
</TouchableOpacity>

 <View style={{width: '100%', height: '35%', backgroundColor: "black"}}>
 <View style={{flexDirection: 'row',}}>
 <Image source={{uri: this.state.userimage}}
 style={{width: '30%', height: '250%', borderRadius: 100/2, marginTop: 40, marginLeft: 10}} />
 </View>
 <View style={{flexDirection: 'row',}} > 
 <Text style={{marginLeft: 250, marginTop: 20, fontWeight: '900', color: '#42a5f5', fontSize: 25}}>{this.state.uname}</Text>
 </View>

 <TouchableOpacity style={{position:'absolute', top: '33%', right: '48%'}} onPress={() => {console.log('userName being passed'+this.state.susername);//this.props.navigation.push('FollowerPage')
}}> 
 {/*
 <TouchableOpacity style={{flexDirection: 'row', marginTop: 10, marginLeft: 140, justifyContent: 'space-around'}} onPress={() => {this.props.navigation.dispatch(StackActions.push('FollowerPage',{sUser:this.state.sUser})) }}> 
*/}
 <Text style={{ fontWeight: 'bold', color: 'white'}}> {this.state.numfollowers}
 </Text>
 </TouchableOpacity>

 <TouchableOpacity style={{position:'absolute',top: '33%', right: '15%'}} onPress={() => {console.log('userName being passed'+this.state.susername);//this.props.navigation.push('FollowingPage')
}}>
 <Text style={{ fontWeight: 'bold', color: 'white'}}> {this.state.numfollowing}
 </Text>
 </TouchableOpacity>

 
 <TouchableOpacity style={{flexDirection: 'row', marginLeft: 140, justifyContent: 'space-around', marginTop: 10}} > 
 <Text style={{ fontWeight: 'bold', color: 'white'}}> Followers 
 </Text>
 <Text style={{ fontWeight: 'bold', color: 'white'}}> Following 
 </Text>
 </TouchableOpacity>
 <View style={{flexDirection: 'row', marginTop: 20}} > 
 <Text style={{ fontSize: 30, color: 'white', marginLeft: 120}}> {'Rating: '+Math.round((((this.state.smash/this.state.total)*25)+
 ((this.state.heat/this.state.total)*15)+
 ((this.state.looseness/this.state.total)*15)+
 ((this.state.thickness/this.state.total)*15)+
 ((this.state.intelligence/this.state.total)*10)+
 ((this.state.savageness/this.state.total)*10)+
 ((this.state.ratchetness/this.state.total)*5)+
 ((this.state.diversity/this.state.total)*5)))/100} </Text> 
 <Image source={{uri: 'https://facebook.github.io/react/logo-og.png'}}
 style={{width: '10%', height: '35%', borderRadius: 100/2, marginLeft: 5}} />
 <TouchableOpacity
 activeOpacity = {0.5} >
 <View style={{flexDirection: 'row', width: '125%', height: '35%', borderRadius: 100/2, marginLeft: 25, backgroundColor: 'black'}}>
 
 </View>
 </TouchableOpacity>
 </View>
 <View style={{flexDirection: 'row', marginTop: -55}}>
 {/*<Text style={{ color: '#42a5f5', fontWeight: 'bold'}}> Title </Text>{*/} 
 </View>
 <View style={{flexDirection: 'row', marginTop: 25}}>
 <Text style={{ color: 'white'}}> {this.state.bio} </Text> 
 </View>

 <View style = {{ height: '13%',
 width: '30%',
 //left: this.state.followingLeft,
 //marginBottom: '5%',
 position:'absolute',
 zIndex:999,
 right:this.state.anonymousright,
 top:'60%'}}>

<TouchableOpacity
 style={{

 backgroundColor:this.state.backgroundColor,
 // padding:this.state.padding, 
 //borderColor:this.state.borderColor,
 borderColor:'white',
 //padding: 1,
 width: '100%',
 height:'100%',
 justifyContent: 'center',
 borderRadius: 5,
 borderWidth: 1,

 }}
 onPress={async()=>{
   this.setState({isFetching:true})
   if(this.state.anonymous==true){
      await this.setState({
         anonymousMessage:'Non-Anonymous',
         anonymous:false,
         sanonymous:false,
         bio:this.state.suserbio,
         uname:this.state.susername,
         first:this.state.sfirstname,
         last:this.state.slastname,
         pic:this.state.suserpic,
      })
      await Promise.all([
         this.follow(),
         this.userpic(),
         this.eventpics(),
         this.ratings()
      ])
      store.dispatch({
         type: "signin",
         payload: { identityid:this.state.identityid,
         username:this.state.username,
         cusername:this.state.username.toUpperCase(),
         ausername:this.state.ausername,
         causername:this.state.ausername.toUpperCase(),
         firstname:this.state.firstname,
         lastname:this.state.lastname,
         incollege:this.state.incollege,
         collegename:this.state.collegename,
         major:this.state.major,
         race:this.state.race,
         gender:this.state.gender,
         birthday:this.state.birthday,
         country:this.state.country,
         userpic:this.state.userpic,
         userbio:this.state.userbio,
         utype:this.state.utype,
         auserbio:this.state.auserbio,
         auserpic:this.state.auserpic,
         orgname:this.state.orgname,
        id:this.state.id,
        anonymous:false,
         }})
      store1.default.dispatch({
            type: "navigate",
            payload: { identityid:this.state.identityid,
            username:this.state.username,
            cusername:this.state.username.toUpperCase(),
            ausername:this.state.ausername,
            causername:this.state.ausername.toUpperCase(),
            firstname:this.state.firstname,
            lastname:this.state.lastname,
            incollege:this.state.incollege,
            collegename:this.state.collegename,
            major:this.state.major,
            race:this.state.race,
            gender:this.state.gender,
            birthday:this.state.birthday,
            country:this.state.country,
            userpic:this.state.userpic,
            userbio:this.state.userbio,
            utype:this.state.utype,
            auserbio:this.state.auserbio,
            auserpic:this.state.auserpic,
            orgname:this.state.orgname,
           id:this.state.id,
           anonymous:false,
            }})
   } else {
      await this.setState({
         anonymousMessage:'Anonymous',
         backgroundColor: 'red',
         anonymous:true,
         sanonymous:true,
         bio:this.state.sauserbio,
         uname:this.state.sausername,
         first:'HBN',
         last:'SAVAGE',
         pic:this.state.sauserpic,
      })
      await Promise.all([
         this.follow(),
         this.userpic(),
         this.eventpics(),
         this.ratings()
      ])
      store.dispatch({
         type: "signin",
         payload: { identityid:this.state.identityid,
         username:this.state.username,
         cusername:this.state.username.toUpperCase(),
         ausername:this.state.ausername,
         causername:this.state.ausername.toUpperCase(),
         firstname:this.state.firstname,
         lastname:this.state.lastname,
         incollege:this.state.incollege,
         collegename:this.state.collegename,
         major:this.state.major,
         race:this.state.race,
         gender:this.state.gender,
         birthday:this.state.birthday,
         country:this.state.country,
         userpic:this.state.userpic,
         userbio:this.state.userbio,
         utype:this.state.utype,
         auserbio:this.state.auserbio,
         auserpic:this.state.auserpic,
         orgname:this.state.orgname,
        id:this.state.id,
        anonymous:true,
         }})
      store1.default.dispatch({
            type: "navigate",
            payload: { identityid:this.state.identityid,
            username:this.state.username,
            cusername:this.state.username.toUpperCase(),
            ausername:this.state.ausername,
            causername:this.state.ausername.toUpperCase(),
            firstname:this.state.firstname,
            lastname:this.state.lastname,
            incollege:this.state.incollege,
            collegename:this.state.collegename,
            major:this.state.major,
            race:this.state.race,
            gender:this.state.gender,
            birthday:this.state.birthday,
            country:this.state.country,
            userpic:this.state.userpic,
            userbio:this.state.userbio,
            utype:this.state.utype,
            auserbio:this.state.auserbio,
            auserpic:this.state.auserpic,
            orgname:this.state.orgname,
           id:this.state.id,
           anonymous:true,
            }})
      }   
      this.setState({isFetching:false})
      {this.forceUpdateHandler()}
 }}
>

 <Text style = {{color: 'white', fontWeight: '500', textAlign: 'center'}}> {this.state.anonymousMessage} </Text>
 
 </TouchableOpacity>
</View>







 <View style = {{ height: '13%',
 width: '30%',
 //left: this.state.followingLeft,
 //marginBottom: '5%',
 position:'absolute',
 zIndex:999,
 right:this.state.followingright,
 top:'80%'}}>

<TouchableOpacity
 style={{

 backgroundColor:this.state.backgroundColor,
 padding:this.state.padding, 
 borderColor:this.state.borderColor,
 borderColor:'white',
 padding: 5,
 width: '100%',
 height:'100%',
 justifyContent: 'center',
 borderRadius: 5,
 borderWidth: 1,
 
 
 }}
 onPress={this.updateFollow}
>

 <Text style = {{color: 'white', fontWeight: '500', textAlign: 'center',}}> {this.state.buttonMessage} </Text>
 
 </TouchableOpacity>
</View>


 <View> 
 <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, borderTopWidth: 1, borderTopColor: "#eae5e5" }}> 
 <Button transparent
 onPress={()=> this.segmentClicked(0)}
 active={this.state.activeIndex == 0}>
 <Icon 
 size= {25}
 name="ios-calendar"
 style={[this.state.activeIndex == 0 ? {color: "#42a5f5"} : {color: 'white'}]} />

 </Button>
 <Button transparent
 onPress={()=> this.segmentClicked(1)}
 active={this.state.activeIndex == 1}>
 <Icon 
 size= {25}
 name="ios-paper"
 style={[this.state.activeIndex == 1 ? {color: "#42a5f5"} : {color: 'white'}]} />

 </Button>
 <Button transparent
 onPress={()=> this.segmentClicked(2)}
 active={this.state.activeIndex == 2}>
 <Icon 
 size= {25}
 name="ios-star-half"
 style={[this.state.activeIndex == 2 ? {color: "#42a5f5"} : {color: 'white'}]} />

 </Button>
 <Button transparent
 onPress={()=> this.segmentClicked(3)}
 active={this.state.activeIndex == 3}>
 <Icon 
 size= {25}
 name="ios-images"
 style={[this.state.activeIndex == 3 ? {color: "#42a5f5"} : {color: 'white'}]} />

 </Button>

 
 </View>
 
 </View>
 
 </View>
 
 {this.renderSection()}
 <ActionButton
 buttonColor="rgba(231,76,60,1)" 
 radius = {120}
 style={styles.actionButton}
 bgColor = 'black'
 btnOutRange = 'black'
 >

 <ActionButton.Item buttonColor='dodgerblue' size = {50} 
 onPress={async() => {
   //console.log(store1)
  await store1.default.dispatch({
    type: "navigate",
    payload: { identityid:this.state.identityid,
    username:this.state.username,
    cusername:this.state.username.toUpperCase(),
    ausername:this.state.ausername,
    causername:this.state.ausername.toUpperCase(),
    firstname:this.state.firstname,
    lastname:this.state.lastname,
    incollege:this.state.incollege,
    collegename:this.state.collegename,
    major:this.state.major,
    race:this.state.race,
    gender:this.state.gender,
    birthday:this.state.birthday,
    country:this.state.country,
    userpic:this.state.userpic,
    userbio:this.state.userbio,
    utype:this.state.utype,
    auserbio:this.state.auserbio,
    auserpic:this.state.auserpic,
    orgname:this.state.orgname,
    id:this.state.id,
    anonymous:this.state.anonymous,
    }});
   this.props.navigation.push('UserProfile')} } >
 <Icon name="ios-contact" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 
 <ActionButton.Item buttonColor='orangered' size = {50} onPress={() => this.props.navigation.push('MainFeedPage')}>
 <Icon name="ios-home" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>


 <ActionButton.Item buttonColor='magenta' size = {50} onPress={() => this.props.navigation.push('Search')}>
 <Icon name="md-search" style={styles.actionButtonIcon}/>
 </ActionButton.Item>

 

 <ActionButton.Item buttonColor='crimson' size = {50} onPress={() => this.props.navigation.push('SelectUpload')}>
 <Icon name="md-cloud-upload" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>
 
 <ActionButton.Item buttonColor='lime' size = {60} onPress={() => this.props.navigation.push('Message')}>
 <Icon name="ios-chatbubbles" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 </ActionButton>

 </Container>
 

 )
}
}

const styles = StyleSheet.create(
 {
 actionButtonIcon: {
 fontSize: 30,
 height: 30, 
 position: 'absolute'
 
 

 // color: 'white',
 }, 
 actionButton: {
 marginTop:15,
 paddingTop:45,
 paddingBottom:15,
 marginLeft:30,
 marginRight:30,
 position: 'absolute'
 },
 
 }
 );

export default UserProfilePage; 