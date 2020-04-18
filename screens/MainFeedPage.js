import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button, Switch, Image, Dimensions, ActivityIndicator,FlatList} from 'react-native';
//import PostFeed from '../components/PostFeed';

import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';

import { CheckBox, CardItem, Content} from 'native-base'

import Modal from "react-native-modal";

import ActionButton from 'react-native-circular-action-menu';

import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations';
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'
import * as store2 from '../redux/store/followingstore'

var radio_props = [
 {label: 'organizations', value: 0 },
 {label: 'users', value: 1 },
 {label:'both', value: 2}
];

class MainFeedPage extends Component {
 static navigationOptions = {
 headerShown: false
 }


 constructor(props) {
 super(props);
 this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
 this.enableMessage = this.enableMessage.bind(this);
 this.timer = setTimeout(this.enableMessage, 1);
 this.state = {
  displayMessage: false,
 currentFollowers: [],
 FollowersPictureData: [],
 FollowerInfomationData: [],
 switch:true,
 isModalVisible: false,
 toggle1Clicked:'',
 toggle2Clicked:'',

 MainFeedimage: [], 
 MainFeedcurrentUser: [],
 //IDENTITYID: '',
 MainFeedorgpicname: [],
 orgoruser:'',
 sUser:{},

 //FilterHeader
 //anonymousswitch: false, 
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
 button2Message: 'HBN local',
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

 //Post
 liked: false, 
 disliked: false,
 screenWidth: Dimensions.get("window").width,
 likes:0,
 dislikes:0,
 comments: 0,
 events:[],
 alllikesquery:[],
 image:'',
 isFetching: false,
 following:store2.default.getState().following,
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

 followings:store2.default.getState().followings
 
 };
 store.subscribe(()=>{this.setState(store.getState())});
 store1.default.subscribe(()=>{this.setState(store1.default.getState())})
 store2.default.subscribe(()=>{this.setState(store2.default.getState())})
 }

 async componentDidMount() {
  /*await API.graphql(graphqlOperation(mutations.createFollow, {input: 
    {followerid:this.state.identityid,
      followingid:this.state.identityid,
      followera:'true',
      followinga:'true'
    }}))
    await API.graphql(graphqlOperation(mutations.createFollow, {input: 
      {followerid:this.state.identityid,
        followingid:this.state.identityid,
        followera:'true',
        followinga:'false'
      }}))
      await API.graphql(graphqlOperation(mutations.createFollow, {input: 
        {followerid:this.state.identityid,
          followingid:this.state.identityid,
          followera:'false',
          followinga:'true'
        }}))
        await API.graphql(graphqlOperation(mutations.createFollow, {input: 
          {followerid:this.state.identityid,
            followingid:this.state.identityid,
            followera:'false',
            followinga:'false'
          }}))*/
      this.props.navigation.addListener('willFocus',this.forceUpdateHandler)
      //console.log("App subscribe this.state:" + JSON.stringify(this.state));
      this.setState({isFetching:true})
        //var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: { followerid: { (eq: this.state.identityid)|() },followera:{eq:String(this.state.anonymous)}} }))
        //var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: {  or:[ {anonymous:{eq:'true'}} , {anonymous:{eq:'false'}} ] }})) 
        //var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: {  or:this.state.followings,anonymous:{eq:'false'} }})) 
        //console.log('         THIS ONE   ')
        //console.log(eventquery)
        //console.log('         THIS ONE   ')
        if(this.state.global==false){
            if(this.state.anonymous==false){
              var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: {  or:this.state.followings,anonymous:{eq:'false'} }})) 
            } else {
              var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: {  or:this.state.followings }})) 
            }
        } else {
            if(this.state.anonymous==false){
              var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: { anonymous:{eq:'false'} }})) 
            } else {
              var eventquery = await API.graphql(graphqlOperation(queries.listEvents)) 
            }
        }
                
        //console.log('                        DID IT WORK                           ????')
        //console.log(eventquery)
        //var eventquery = await API.graphql(graphqlOperation(queries.listEvents)) 

        await this.setState({events:eventquery.data.listEvents.items})
        //console.log(this.state.events)
        await Promise.all([
          this.postername(),
          this.userlikes(),
          this.alllikes(),
          this.eventpics(),
          this.rating(),
          this.posterpics()
        ])
        this.setState({ isFetching: false })        
  }


/*}
      load = async() => {
        this.componentDidMount();
        this.forceUpdate();
      }
    {*/

      forceUpdateHandler(){
        this.componentDidMount();
        this.forceUpdate();
      };
     

  
      enableMessage() {
        this.setState({displayMessage: true});
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

    rating=async()=>{
     for(let k=0;k<this.state.events.length; k++){ 

        var cratings = await API.graphql(graphqlOperation(queries.listProfileratingss, { filter: { ratedid: { eq: this.state.events[k].identityid }} } ))
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
        this.state.events[k].rating="Rating "+((((this.state.smash/this.state.total)*25)+
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


    postername=async()=>{
      for(let i=0;i<this.state.events.length; i++){
        var xxx= await API.graphql(graphqlOperation(queries.listUserinfos, {filter:{identityid:{eq:this.state.events[i].identityid} } } ))
        if(this.state.events[i].anonymous=='true'){
          this.state.events[i].postername='Ghost'
          this.state.events[i].pusername="@"+xxx.data.listUserinfos.items[0].ausername
        } else {
          this.state.events[i].postername=xxx.data.listUserinfos.items[0].firstname+' '+xxx.data.listUserinfos.items[0].lastname
          this.state.events[i].pusername="@"+xxx.data.listUserinfos.items[0].username
        }
      }
      return Promise
    }


      userlikes=async ()=> {
        for(let i=0;i<this.state.events.length; i++){
          var cuserlikesquery = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: {eid: { eq: this.state.events[i].eid },identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))
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
                        .then(async data => {await this.setState({image: data})})
          this.state.events[i].eventpic=this.state.image
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




async onRefresh() {
  await this.setState({ isFetching: true });
  if(this.state.global==false){
      if(this.state.anonymous==false){
        var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: {  or:this.state.followings,anonymous:{eq:'false'} }})) 
      } else {
        var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: {  or:this.state.followings }})) 
      }
  } else {
      if(this.state.anonymous==false){
        var eventquery = await API.graphql(graphqlOperation(queries.listEvents, { filter: { anonymous:{eq:'false'} }})) 
      } else {
        var eventquery = await API.graphql(graphqlOperation(queries.listEvents)) 
      }
  }
  await this.setState({events:eventquery.data.listEvents.items})
        await Promise.all([this.postername(),
                            this.userlikes(),
                            this.alllikes(),
                            this.eventpics(),
                            this.rating(),
                            this.posterpics()
        ])
        this.setState({ isFetching: false })
}





 render(){
 const { navigation } = this.props;



 const {displayMessage} = this.state;

  if (!displayMessage) {
    return<View style={{
      
      width: '100%',
      height: '100%',
      backgroundColor:'black'
    }}><ActivityIndicator color= 'cyan' size='large' style={{marginTop:250,bottom:'0%'}} /></View>;
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
 
 {/*{this.state.anonymous == false && this.state.global == false ?*/}

<FlatList 
    data={this.state.events}
    //data={this.state.image}
    extraData={this.state.switch1}
    numColumns = {this.state.numColumnss}
    key={this.state.numColumnss}
    onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
    renderItem={ ({ item }) => (
    <View style = {{flex:1, width: 100 + "%", backgroundColor:'black'}}> 
    
    <View style = {{ width:  "100%",height: 200, backgroundColor: 'black', 
                     justifyContent: "center",  top: 20,borderColor: "gray",borderWidth:1}}> 
    
    
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

<Image style = {styles.ratingIcon} /> 


    <View style = {styles.iconBar}>
    

    

    <TouchableOpacity onPress ={ async() => { 
      var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))

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
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous),likes: "1"} }))
        } else {
          this.state.events[index].alllikes=this.state.events[index].alllikes+1
          this.state.events[index].cuserdisliked='grey'
          this.state.events[index].cuserliked='cyan'
          this.setState({switch1:!this.state.switch1})
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous), likes: "1"} }))
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
      var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: item.eid},identityid:{eq:this.state.identityid} ,anonymous:{eq:String(this.state.anonymous)}} } ))
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
          this.setState({switch1:!this.state.switch1})
          await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:cevent.data.listEventlikes.items[0].id} }))
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous),likes: "-1"} }))        
        } else {
          this.state.events[index].alldislikes=this.state.events[index].alldislikes+1
          this.state.events[index].cuserliked='grey'
          this.state.events[index].cuserdisliked='cyan'
          this.setState({switch1:!this.state.switch1})
          await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:item.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous),likes: "-1"} }))
        }
      }
      //this.onRefresh()
      //console.log(this.state.events[index].cuserliked,"  disliked:   ",this.state.events[index].cuserdisliked)
    }}>

    <FontAwesome style = {{marginLeft: 50,color:item.cuserdisliked}} name = "thumbs-o-down" size={20} />

    </TouchableOpacity>

    

    <Text style = {{color: 'gray'}}> {item.alldislikes} </Text>

    


    
    
    <TouchableOpacity>
    
    <FontAwesome style = {styles.commentIcon} name = "comment-o" size={20} />

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



{/*} <PostFeed 
style = {{ top: 100,}}
navigation={navigation}/>
 }*/}
 
 
 


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

 <ActionButton.Item buttonColor='orangered' size = {50} onPress={() => this.props.navigation.push('MainFeedPage')}>
 <Ionicons name="ios-home" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 <ActionButton.Item buttonColor='magenta' size = {50} onPress={() => this.props.navigation.push('Search')}>
 <Ionicons name="md-search" style={styles.actionButtonIcon}/>
 </ActionButton.Item>

 

 <ActionButton.Item buttonColor='crimson' size = {50} onPress={() => this.props.navigation.push('SelectUpload')}>
 <Ionicons name="md-cloud-upload" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>
 
 <ActionButton.Item buttonColor='lime' size = {60} onPress={() => this.props.navigation.push('Message')}>
 <Ionicons name="ios-chatbubbles" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 </ActionButton>

 
 
 </View>
 );
 }

 


}

const styles = StyleSheet.create(
 {
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

 activity: {
 color: "gray",
 fontSize: 13
 },

 commentBar: {
 width: 100 + "%",
 height: 50,
 borderColor: 'rgb(233,233,233)',
 borderTopWidth: StyleSheet.hairlineWidth,
 borderBottomWidth: StyleSheet.hairlineWidth,
 
 },

 commentIcon: {
 marginLeft: 50,
 color: "gray"
 },


 dislikeIcon:{
 marginLeft: 50,
 color:"gray"
 },


 eventName: {
 marginLeft: 10,
 color: 'white',
 fontSize: 18,
 fontWeight:'300'
 },

 eventDescription: {
 height: 40,
 width: 280,
 position: "absolute",
 bottom: 15,
 right: 12,
 
 },
 
 eventPicture: {
 height: 180,
 top: 20,
 width: 200 + '%',
 marginRight: 1,
 bottom: 20
 },
 

 headerText: {
 color: 'white',
 fontSize: 20,
 textAlign: "center",
 marginTop: 10
 },


 iconBar: {
 height: 60,
 width: 100 + "%",
 flexDirection: 'row',
 alignItems: 'flex-start',
 borderBottomWidth: 1,
 borderColor: "gray",
 top: 30
 
 },

 likeIcon:{
 marginLeft: 15,
 color: "gray"
 },

 organizationBar: {
 height: 30,
 width: 280,
 flexDirection: 'row',
 alignItems: 'flex-start',
 top:10
 
 },


 organizationHandle: {
 
 color: 'cyan',
 fontSize: 16,
 
 
 },

 
 organizationName: {
 marginLeft: 10,
 color: 'white',
 fontSize: 20,
 fontWeight: '500',
 
 },

 
 organizationPic: {
 height: 60,
 width: 60,
 borderRadius: 30,
 borderColor: 'white',
 borderWidth: 1,
 top: 10,
 resizeMode: 'contain'
 
 
 
 },


 rating: {
 position: "absolute",
 right: 40,
 color: "gray",
 fontSize: 14
 },
 
 ratingIcon: {
 position: "absolute",
 right: 10,
 height: 30,
 width: 30,
 },
 
 tempNav: {
 width: 100 + "%",
 height: 56,
 marginTop: 20,
 justifyContent: 'center',
 alignItems: 'center',
 backgroundColor: '#101011',
 borderBottomWidth: StyleSheet.hairlineWidth,
 },

 
 userBar: {
 width: 100 + "%",
 height: 90,
 backgroundColor: 'black',
 flexDirection: "row",
 justifyContent: "center",
 borderColor: "gray",
 top: 20
 
 
 },

 }
 );


export default MainFeedPage; 

MainFeedPage.navigationOptions={ 
tabBarIcon:({tintColor, focused})=>( 
 <Ionicons
 name={'ios-calendar'} 
 color={tintColor} 
 size={25} 
 /> 

 ),
};