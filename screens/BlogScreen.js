import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'

import React , { Component } from 'react';
//import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, Text, TouchableOpacity, Button, ActivityIndicator, Image, Dimensions, FlatList, Animated, Alert} from 'react-native';
import { CheckBox, CardItem, Content} from 'native-base'
import Modal from "react-native-modal"
import ActionButton from 'react-native-circular-action-menu'
import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'
 
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'
import * as store2 from '../redux/store/followingstore'

class BlogScreen extends React.Component{
 
 static navigationOptions = {
 headerShown: false
 }
 
 constructor(props) {
 super(props);
 this.enableMessage = this.enableMessage.bind(this);
 this.state = {
 liked: false, 
 disliked: false,
 screenWidth: Dimensions.get("window").width,
 likes:0,
 dislikes:0,
 comments: 0,
 modalVisible: false,
 descriptionHeight: 270,
 //animationValue: new Animated.Value(130),
 animationValue: 5,
 viewState : true,
 text: 'Show more',
 blogHeight: 190,
 likecolor: 'gray',
 dislikecolor: 'gray',
switch1:false,
 currentFollowers: [],
 FollowersPictureData: [],
 FollowerInfomationData: [],
 
 isModalVisible: false,
 toggle1Clicked:'',
 toggle2Clicked:'',
 
 MainFeedimage: [], 
 MainFeedcurrentUser: [],
 IDENTITYID: '',
 MainFeedorgpicname: [],
 orgoruser:'',
 sUser:{},
 
 //FilterHeader
 //anonymous: false, 
 button1Message:'non-anonymous',
 button1BackgroundColor: 'cyan',
 button1TextColor: 'black',
 button1BorderColor: 'cyan',
 button1Image: [
 "https://cdn.shopify.com/s/files/1/1061/1924/products/Angel_Halo_Emoji_Icon_0ff75c27-5416-4ac6-bf1a-2a2d44b0a32b_large.png?v=1571606089",
 "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Devil_Emoji_grande.png?v=1571606036"
 
 ], 
 button1SelectedIndex: 0,
 
 //states for dynamic 'local' button
 button2BackgroundColor: 'cyan',
 button2BorderColor: 'cyan',
 button2TextColor:'black',
 button2Message: 'local',
 global: false,
 button2Image: [
 "https://cdn.shopify.com/s/files/1/1061/1924/products/House_Emoji_With_Tree_large.png?v=1571606064",
 "https://cdn.shopify.com/s/files/1/1061/1924/products/Emoji_Earth_Globe_Europe_Africa_large.png?v=1571606068"
 ], 
 button2SelectedIndex: 0,
 
 isModalVisible: false, //hides modal when load app
 
 radioButton1Pressed: true,
 radioButton2Pressed: false,
 radioButton3Pressed: false,
 
 blobea: [],
 bloblikea: [], 
 numlikesa: 0,
 numdislikesa: 0,
 blogid: [],
 isFetching: false,

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
 following:store2.default.getState().following,
 followings:store2.default.getState().followings,
 followingsb:store2.default.getState().followingsb,

 //suserb: {},
 blogs: [], 
 image: ''
 
 };
 this.timer = setTimeout(this.enableMessage, 1);
 store.subscribe(()=>{this.setState(store.getState())});
 store1.default.subscribe(()=>{this.setState(store1.default.getState())})
 store2.default.subscribe(()=>{this.setState(store2.default.getState())})
 }

 async componentDidMount() {
                this.props.navigation.addListener('willFocus',this.load)
                console.log("App subscribe this.state:" + JSON.stringify(this.state));
                /*const credentials = await Auth.currentCredentials()
                const identityIds = credentials.identityId
                this.state.IDENTITYID = identityIds
                //this.state.identityid = this.state.IDENTITYID
                var AllUserData = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { identityid: { eq: this.state.IDENTITYID } } } ))
                this.setState({suserb:AllUserData.data.listUserinfos.items[0]})*/
                this.setState({isFetching:true})
                if(this.state.global==false){
                    if(this.state.anonymous==false){
                        this.setState({
                            button1Message:'non-anonymous',
                            button1BackgroundColor: 'cyan',
                            button1TextColor: 'black',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 0,
                        })
                        var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: {  or:this.state.followingsb,anonymous:{eq:'false'} }})) 
                    } else {
                        this.setState({
                            button1Message:'Ghost',
                            button1BackgroundColor: 'black',
                            button1TextColor: 'white',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 1,
                        })
                      var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: {  or:this.state.followingsb }})) 
                    }
                } else {
                    if(this.state.anonymous==false){
                        this.setState({
                            button1Message:'non-anonymous',
                            button1BackgroundColor: 'cyan',
                            button1TextColor: 'black',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 0,
                        })
                        var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { anonymous: { eq: 'false' }} } ))
 
                    } else {
                        this.setState({
                            button1Message:'Ghost',
                            button1BackgroundColor: 'black',
                            button1TextColor: 'white',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 1,
                        })
                        var blogquery = await API.graphql(graphqlOperation(queries.listBlogs )) 
                    }
                }
                console.log(blogquery)
                //var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { anonymous: { eq: true }} } ))
                await this.setState({blogs:blogquery.data.listBlogs.items})
                console.log(this.state.blogs)
                //console.log('this.state.blogs: ', this.state.blogs)
                await Promise.all([
                    this.userlikesb(),
                    this.alllikesb(),
                    this.posterpicsb(),
                    this.posternameb(),
                    this.ratingb()
                ])
                this.setState({isFetching:false})
 }


    ratingb=async () =>{
        for(let k=0;k<this.state.blogs.length; k++){ 
        
            var cratings = await API.graphql(graphqlOperation(queries.listProfileratingss, { filter: { ratedid: { eq: this.state.blogs[k].identityid }} } ))
            var total = Number(cratings.data.listProfileratingss.items.length)
            await this.setState({total:total})
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
                this.state.blogs[k].rating="Rating "+((((this.state.smash/this.state.total)*25)+
                    ((this.state.heat/this.state.total)*15)+
                    ((this.state.looseness/this.state.total)*15)+
                    ((this.state.thickness/this.state.total)*15)+
                    ((this.state.intelligence/this.state.total)*10)+
                    ((this.state.savageness/this.state.total)*10)+
                    ((this.state.ratchetness/this.state.total)*5)+
                    ((this.state.diversity/this.state.total)*5))/100)
        }
        return Promise
    }

 userlikesb= async() => {
    for(let i=0;i<this.state.blogs.length; i++){
        var cuserlikesqueryb = await API.graphql(graphqlOperation(queries.listBloglikes, { filter: {bid: { eq: this.state.blogs[i].bid },identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))
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

 posterpicsb=async()=>{
    for(let i=0;i<this.state.blogs.length; i++){
        var posterpic = await API.graphql(graphqlOperation(queries.listUserpics, { filter: {identityid:{eq:this.state.blogs[i].identityid} } } ))
        if(String(this.state.blogs[i].anonymous)=="true"){
            var pic = posterpic.data.listUserpics.items[0].auserpic  
          } else {
            var pic = posterpic.data.listUserpics.items[0].userpic 
          }
        await Storage.get(posterpic.data.listUserpics.items[0].userpic, {level: 'protected',identityId:this.state.blogs[i].identityid})
        .then(async data => {await this.setState({image: data})})
    this.state.blogs[i].posterpic=this.state.image
    }
    return Promise
 } 

 posternameb=async()=>{
    for(let i=0;i<this.state.blogs.length; i++){
        var xxx= await API.graphql(graphqlOperation(queries.listUserinfos, {filter:{identityid:{eq:this.state.blogs[i].identityid} } } ))
        if(this.state.blogs[i].anonymous=='true'){
            this.state.blogs[i].postername='Ghost'
            this.state.blogs[i].pusername="@"+xxx.data.listUserinfos.items[0].ausername
        } else {
            this.state.blogs[i].postername=xxx.data.listUserinfos.items[0].firstname+' '+xxx.data.listUserinfos.items[0].lastname
            this.state.blogs[i].pusername="@"+xxx.data.listUserinfos.items[0].username
        }
    }
    return Promise
 }


 enableMessage() {
 this.setState({displayMessage: true});
 }

 updateAnon = async() => {
    /*if (this.state.button1SelectedIndex != 1) {
      this.setState(prevState => ({
      button1SelectedIndex: 1 
      })); 
    } else{
      this.setState(prevState => ({
      button1SelectedIndex:0
      }))
    }*/

    if(!this.state.anonymous) { 
      await this.setState({
        button1BackgroundColor: 'black',
        button1BorderColor: 'gray',
        button1TextColor: 'white',
        anonymous: true,
        button1Message: 'Ghost'})
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
        this.onRefresh()
    } else {
      await this.setState({ 
        button1BackgroundColor: 'cyan',
        button1BorderColor: 'cyan',
        button1TextColor:'black',
        button1Message: 'non-anonymous',
        anonymous: false 
      })
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
      this.onRefresh()
    } 
}

updateGlobal = async() => {
    /*if (this.state.button2SelectedIndex != 1) {
    this.setState(prevState => ({
    button2SelectedIndex: 1 
    })); 
    } else{
    this.setState(prevState => ({
    button2SelectedIndex:0
    }))
    }*/



    if(!this.state.global) { 
      await this.setState({
        button2BackgroundColor: 'black',
        button2BorderColor: 'gray',
        button2TextColor: 'white',
        global: true,
        button2Message: 'HBN global',
      })
      this.onRefresh()

    } else {
      await this.setState({ 
        button2BackgroundColor: 'cyan',
        button2BorderColor: 'cyan',
        button2TextColor:'black',
        button2Message: 'HBN local',
        global: false 
      })
      this.onRefresh()

    } 
}
 
 toggleAnimation=()=>{/*
 
 if(this.state.viewState == true){
 Animated.timing(this.state.animationValue, {
 toValue : 230, 
 duration: 1
 }).start(()=>{
 this.setState({viewState : false, text:'Show less', blogHeight:300})
 });
 }
 else{
 Animated.timing(this.state.animationValue, {
 toValue : 130,
 duration: 1
 }).start(this.setState({viewState: true, text:'Show more', blogHeight:200})
 );
 }*/
 }

 toggleModal = () => {
 this.setState({ isModalVisible: !this.state.isModalVisible });
 };
 
 onePressed = () =>{
 this.setState({radioButton1Pressed: true, radioButton2Pressed: false, radioButton3Pressed: false})
 }
 
 twoPressed = () =>{
 this.setState({radioButton2Pressed: true, radioButton1Pressed: false, radioButton3Pressed: false})
 }
 
 threePressed = () =>{
 this.setState({radioButton3Pressed: true, radioButton1Pressed: false, radioButton2Pressed: false})
 }

 _showMorePress = () => {
 this.setState({ descriptionHeight: 500 });
 };

 _renderTruncatedFooter = (_showMorePress) => {
 return (
 <Text style={{color: 'gray', marginTop: 5}} onPress={_showMorePress}>
 Read more
 </Text>
 );
 }
 
 _renderRevealedFooter = (handlePress) => {
 return (
 <Text style={{color: 'gray', marginTop: 5}} onPress={handlePress}>
 Show less
 </Text>
 )
 }
 
 _handleTextReady = () => {
 // ...
 }
 
 async onRefresh() {
    this.setState({isFetching:true})
                if(this.state.global==false){
                    if(this.state.anonymous==false){
                        this.setState({
                            button1Message:'non-anonymous',
                            button1BackgroundColor: 'cyan',
                            button1TextColor: 'black',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 0,
                        })
                        var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: {  or:this.state.followingsb,anonymous:{eq:'false'} }})) 
                    } else {
                        this.setState({
                            button1Message:'Ghost',
                            button1BackgroundColor: 'black',
                            button1TextColor: 'white',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 1,
                        })
                    var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: {  or:this.state.followingsb }})) 
                    }
                } else {
                    if(this.state.anonymous==false){
                        this.setState({
                            button1Message:'non-anonymous',
                            button1BackgroundColor: 'cyan',
                            button1TextColor: 'black',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 0,
                        })
                        var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { anonymous: { eq: 'false' }} } ))

                    } else {
                        this.setState({
                            button1Message:'Ghost',
                            button1BackgroundColor: 'black',
                            button1TextColor: 'white',
                            button1BorderColor: 'cyan',
                            button1SelectedIndex: 1,
                        })
                        var blogquery = await API.graphql(graphqlOperation(queries.listBlogs )) 
                    }
                }
                //var blogquery = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { anonymous: { eq: true }} } ))
                await this.setState({blogs:blogquery.data.listBlogs.items})
                console.log('this.state.blogs: ', this.state.blogs)
                await Promise.all([
                    this.userlikesb(),
                    this.alllikesb(),
                    this.posterpicsb(),
                    this.posternameb(),
                    this.ratingb()
                ])
                this.setState({isFetching:false})
}

load = async() => {

}
 
 render(){
 const {displayMessage} = this.state;

 if (!displayMessage) {
 return null;
 }
 const { search } = this.state;


 const imageHeight = Math.floor(this.state.screenWidth * 1.1);
 const imageSelection = 
 this.props.item % 2 == 0 
 ? "https://www.nsbe.org/getattachment/28832cde-2300-42ed-8121-e41f9f9d7c2d/nsbe46-save-the-date.aspx"
 : "https://image.slidesharecdn.com/nsbegeneralbody1-20-16-160121134003/95/usf-nsbe-gbm-1202016-1-638.jpg?cb=1453383709";
 
 const imageUri = imageSelection + "=s" + imageHeight + "-c";

 const likeIcon = this.state.liked ? 'rgb(252,61,57)': null;
 const dislikeIcon = this.state.disliked ? 'rgb(252,61,57)': null;
 const animatedStyle = {
 height : this.state.animationValue
 }

 const animatedHeight = {
 height: this.state.blogHeight
 }

 if (this.state.isFetching) {
 return <View style={{
    width: '100%',
    height: '100%',
    backgroundColor:'black'
  }}><ActivityIndicator color= 'cyan' size='large' style={{marginTop:250,bottom:'0%'}} /></View>;
 }

 return(
 
 <View style = {{flex:1, width:100 + "%", height: 100 + "%", backgroundColor:'black', paddingBottom: 10 }}>
 
 <View style = {{borderBottomWidth: 0.2, borderColor: 'cyan', width: '100%', height: 90, flexDirection: 'row'}}> 
 
 <TouchableOpacity 
        onPress={this.toggleModal}
        style = {{left: '46.8%', top:'15%' , position: 'absolute'}} 
        >
          <Ionicons name={'ios-eye'} color='white' size={35} /> 

          </TouchableOpacity>

          <View style={{top: 10, left: 10,position:'absolute'}}>
        <TouchableOpacity style={{backgroundColor:this.state.button1BackgroundColor, borderColor:this.state.button1BorderColor, padding: 5, width: 150,height:40, justifyContent: 'center', borderRadius: 5, borderWidth: 1, left: 5,}}
          onPress={this.updateAnon}>
          <View style={{position:'absolute',left:'0%'}}>
              <Text style = {{color: this.state.button1TextColor, fontWeight: '500', textAlign: 'center',}}> {this.state.button1Message} </Text>

          </View>
          <View style ={{position:'absolute',right:'0%'}}>
            <Image source={{ uri: this.state.button1Image[this.state.button1SelectedIndex]}} style={{height: 30, width: 30,   backgroundColor: 'black'}} />

          </View>
        </TouchableOpacity>
        
        </View>



        <View style={{top: 10, right: 10, position: 'absolute'}}>
        <TouchableOpacity style={{backgroundColor:this.state.button2BackgroundColor, borderColor:this.state.button2BorderColor, padding: 5, width: 150, height:40, justifyContent: 'center', borderRadius: 5, borderWidth: 1, right: 5,}}
        onPress={this.updateGlobal}>
         <View style={{position:'absolute',left:'0%'}}>
        <Text style = {{color: this.state.button2TextColor, fontWeight: '500', textAlign: 'center'}}> {this.state.button2Message} </Text>
        </View>
        <View style ={{position:'absolute',right:'0%'}}>
        <Image source={{ uri: this.state.button2Image[this.state.button2SelectedIndex]}} style={{height: 30, width: 30,  backgroundColor: 'black'}} />
        </View>
        </TouchableOpacity>
        
        </View>
 

 <Modal isVisible={this.state.isModalVisible}>
{/* what you see when you click on the eye icon */}

 <View style={{ backgroundColor: 'black', height: 230, width: 400, top: -40, left:-30}}>
 
 <View style = {{top: 20, width: '100%', height: 240, left: 10, borderColor: 'white', backgroundColor: 'black'}}> 
 <Content style = {{backgroundColor: 'black'}}> 

 <CardItem header style = {{backgroundColor: 'black'}}>
 <Text style = {{color: 'white'}}> Select mainfeed filter options</Text>
 </CardItem>
 <CardItem body style = {{backgroundColor: 'black'}}>
 <CheckBox checked = {this.state.radioButton1Pressed}
 onPress = {this.onePressed}
 style = {{marginRight:20}}
 />
 <Text style = {{color: 'white'}} > See posts from users and organizations </Text>
 </CardItem>
 
 <CardItem body style = {{backgroundColor: 'black'}}>
 <CheckBox checked = {this.state.radioButton2Pressed}
 onPress = {this.twoPressed}
 style = {{marginRight:20}}
 />
 <Text style = {{color: 'white'}}> Only see posts from users </Text>
 </CardItem>

 <CardItem body style = {{backgroundColor: 'black'}}>
 <CheckBox checked = {this.state.radioButton3Pressed}
 onPress = {this.threePressed}
 style = {{marginRight:20}}
 />
 <Text style = {{color: 'white'}}> Only see posts from organizations </Text>
 </CardItem>

 <CardItem right
 style = {{backgroundColor: 'black'}}>
 <Button style = {{ bottom: 10, left: -40 }} title="Save" onPress={this.toggleModal} />
 </CardItem>
 
 </Content> 
 </View>
 </View>
 
 </Modal>
 </View>
 
 {/*this.state.anonymous == false && this.state.global == false ?*/}
<FlatList 
extraData={this.state.switch1}
 data={this.state.blogs}
 numColumns = {this.state.numColumnss}
 key={this.state.numColumnss}
 onRefresh={() => this.onRefresh()}
 refreshing={this.state.isFetching}
 renderItem={ ({ item }) => (


 <View style = {styles.background}> 
 {/*console.log('this.state.blogs: ', this.state.blogs)*/}
 <View style = {styles.blogContainer, animatedHeight}> 
 
 <View style = {styles.textContainer}> 
 
 <View style ={styles.icon}>
 <FontAwesome style ={styles.usericon} name = "user-secret" size={20}/> 
 </View>
 
 <View style = {styles.usernameview}>
 
 <Text style ={styles.username}>

 {item.posterpic}
 </Text>
 
 </View> 

 <View style={styles.timeview}>
 <Text style ={styles.time}>
 5 hours ago
 </Text>
 
 </View>

 <View style = {styles.titleContainer}> 
 <Text style = {styles.title} >{item.bname} </Text> 
 
 </View>

 <View style={{borderColor:'transparent', borderWidth: 1, height: 0, width: 425 ,
 top: 247, left:0 }}>
 
 </View>

 <View style = {styles.nameContainer}>
 
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

 <View style = {styles.iconBar}>
 
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

}}>

 <FontAwesome style = {{marginLeft: 100, top: 22, left:-50, color:item.cuserdisliked}} name = "thumbs-o-down" size={20} />

 </TouchableOpacity>

 <Text style = {{color: 'grey',left:-48,top:24}}> {item.alldislikes} </Text>
 
 <TouchableOpacity onPress = {this.commentpress}>
 <FontAwesome style = {styles.commentIcon} name = "comment-o" size={20} />
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
{/*}: this.state.anonymous == false && this.state.global == true ? 
<View style={{backgroundColor:'red', width: '100%', height: '100%'}}>
<Text> PLEASE WORK</Text>
</View> : <View style={{backgroundColor:'red', width: '100%', height: '100%'}}>
<Text> PLEASE WORK 2</Text>
</View> */}
 
 
 
 
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
   this.props.navigation.push('UserProfile')} }>
 <Ionicons name="ios-contact" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 <ActionButton.Item buttonColor='orangered' size = {50} onPress={() => this.props.navigation.navigate('MainFeedPage')}>
 <Ionicons name="ios-home" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 <ActionButton.Item buttonColor='magenta' size = {50} onPress={() => this.props.navigation.navigate('Search')}>
 <Ionicons name="md-search" style={styles.actionButtonIcon}/>
 </ActionButton.Item>

 

 <ActionButton.Item buttonColor='crimson' size = {50} onPress={() => this.props.navigation.navigate('SelectUpload')}>
 <Ionicons name="md-cloud-upload" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>
 
 <ActionButton.Item buttonColor='lime' size = {60} onPress={() => this.props.navigation.navigate('Message')}>
 <Ionicons name="ios-chatbubbles" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 </ActionButton>
 
 </View>

 
 )
}

}
export default BlogScreen;

const styles = StyleSheet.create({
 
 actionButtonIcon: {
 fontSize: 30,
 height: 30, 
 
 // color: 'white',
 }, 
 actionButton: {
 marginTop:15,
 paddingTop:45,
 paddingBottom:15,
 marginLeft:30,
 marginRight:30,
 },

 activity:
 { 
 color: 'white',
 fontSize: 14,
 fontWeight:'300',
 
 },
 background:{
 flex:1, width: 100 + "%", backgroundColor:'black'
 },
 blogContainer: {
 width: 100 + "%",
 height: 200,
 backgroundColor: 'black',
 flexDirection: "row",
 borderBottomWidth: 0.4,
 borderColor: 'transparent',
 top: 17,
 },
 blogTitle:
 {
 color: 'white',
 fontSize: 16,
 fontWeight:'bold',
 left: 10,
 },
 commentIcon: {
 marginLeft: 100,
 color: "gray",
 top: 22,
 left: -55
 },
 date:{
 position: 'absolute',
 left: 75,
 top: 70,
 color: 'white',
 fontSize: 14,
 fontWeight:'200',
 },
 dislikeIcon:{
 marginLeft: 100,
 color:"gray",
 top: 22,
 left:-50
 },
 iconBar: {
 height: 50,
 width: 100 + "%",
 flexDirection: 'row',
 alignItems: 'flex-start',
 borderBottomWidth: 1,
 borderColor: "gray",
 top:0
 },
 interactionContainer: {
 position: 'absolute',
 top: 75,
 height: 40,
 width: 350,
 left: 10,
 flexDirection:'row',
 },
 interactions: {
 fontSize: 16,
 color: 'cyan',
 fontWeight: 'bold', 
 },
 nameContainer: {
 position: 'absolute',
 top: 40,
 height: 100,
 width: 300,
 flexDirection:'row',
 
 },
 textContainer:{
 
 position: 'absolute',
 height: 95 ,
 width: '100%' ,
 marginTop: 5,
 backgroundColor: 'black',
 justifyContent:'center',
 flex: 1,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center', 
 },
 title: {
 
 color: 'white',
 fontSize: 20,
 fontWeight:'700',
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center',
 justifyContent: 'center',
 top:-10
 //position: 'absolute',
 //right: 0,
 },

 titleContainer: {
 position: 'absolute',
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
 alignContent: 'center',
 },
 username: {
 fontSize: 13,
 color: 'gray',
 top:2,
 left: -3
 },
 usernameview:{
 
 backgroundColor: 'black',
 height: 20,
 width:100,
 position: 'absolute',
 top:0,
 left:28,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'
 },
 timeview:{
 backgroundColor: 'black',
 height:30,
 width:80,
 position:'absolute',
 top: 0,
 right: 0,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'
 },
 time:{
 fontSize:11,
 color:'gray',
 top: 3
 },
 icon:{
 backgroundColor: 'black',
 height:20,
 width: 20,
 position:'absolute',
 left: 5,
 top:15,
 textAlign: 'center',
 alignItems: 'center',
 alignContent: 'center'
 },
 usericon:{
 color:'cyan',
 position:'absolute',
 left:2,
 top: -15

 },
 description:{
 borderColor:'transparent', top:0,
 borderWidth:1,width:390,height:140, 
 left:14
 }
 
});
