//import * as ImagePicker from 'expo-image-picker';
import React, { Component} from 'react';
import { Switch, View, TextInput, StyleSheet, Image, TouchableOpacity, Button, Text} from 'react-native';
import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
//import ActionButton from 'react-native-circular-action-menu';
//import { configureAmplify, SetS3Config } from '../../service.js';
import { Kaede } from 'react-native-textinput-effects';
//import Icon from 'react-native-vector-icons/Ionicons';
//import ImagePicker from 'react-native-image-picker';
//import ImagePicker from 'react-native-image-crop-picker';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries'
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'
import * as store2 from '../redux/store/followingstore'
//import { Header } from 'react-native/Libraries/NewAppScreen';




class BlogUploadPage extends Component {
  static navigationOptions = {
    header: null
}


  constructor(props){
    super(props);

    //this.handleChoosePhoto = this.handleChoosePhoto.bind(this);

    this.state = {
      EventName: '', Time: '', Location: '', currentEvent: [],  EventD: '',
    height: 0, photo: '', user: '',captioni:'',blogtitlei:'',
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
 anonymousswitch:store.getState().anonymous
    }
    store.subscribe(()=>{this.setState(store.getState())});
 store1.default.subscribe(()=>{this.setState(store1.default.getState())})
 store2.default.subscribe(()=>{this.setState(store2.default.getState())})
  }
  
  

  async componentDidMount(){
    /*var credentials = await Auth.currentCredentials()
        var identityIds = credentials._identityId
        this.setState({identityid:identityIds})
        console.log('identityId: ', this.state.identityid)*/
  }



  uploadToStorage = async () => {
    
    try{
      //console.log(this.state.blogtitlei)
      //console.log(this.state.captioni)
      //console.log(this.state.anonymous)
      /*try{
        var ProductData = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { blogtitle: { eq: this.state.blogtitlei }, identityid:{eq:this.state.identityid} } } ))
      } catch{}*/
      var ProductData = await API.graphql(graphqlOperation(queries.listBlogs, { filter: { bname: { eq: this.state.blogtitlei }} } ))
      //console.log(ProductData)
      //console.log('QUERIED')
      
        if(ProductData.data.listBlogs.items.length>0){
            //var cproductrowid = ProductData.data.listblogs.items[0].id
            alert ('There is already a blog with this title.')
            return 
            //await API.graphql(graphqlOperation(mutations.deleteblog, {input: {id:cproductrowid} }))
            //await API.graphql(graphqlOperation(mutations.createblog, {input: {blogtitle:this.state.blogtitlei, blogdescription:this.state.captioni,identityId:this.state.identityid, anonymous: this.state.anonymous} }))
        } else {
            alert('Blog Posted.')
            //console.log('Made it')
            //console.log(queries.listBlogs)
           // var queries1=queries
            //console.log('new')
            //console.log(queries1)
            //console.log(queries1[0][0])
            //await API.graphql(graphqlOperation(mutations.createBlog, {input: {id:'1', blogtitle:this.state.blogtitlei, blogdescription:this.state.captioni,identityid:this.state.identityid, anonymous: this.state.anonymous} }))
            
            var ProductData = await API.graphql(graphqlOperation(queries.listBlogsid ))
            //console.log(ProductData)
            var blognum = 0
            for(let i=0;i<ProductData.data.listBlogs.items.length; i++){
                if(Number(ProductData.data.listBlogs.items[i].bid.split('r')[0]) > blognum){
                    blognum=Number(ProductData.data.listBlogs.items[i].bid.split('r')[0])
                } else {}
                //blognum = [...blognum,Number(ProductData.data.listBlogs.items[i].id.split('r')[0]) ]
            }
            //console.log(blognum)
            //console.log(Math.max(blognum.values))
            //console.log(ProductData)
            await API.graphql(graphqlOperation(mutations.createBlog, {input: {bid:(blognum+1), bname:this.state.blogtitlei, cbname:this.state.blogtitlei.toUpperCase(), bdetails:this.state.captioni,identityid:this.state.identityid, anonymous: String(this.state.anonymous),bida:(this.state.identityid+String(this.state.anonymous))} }))

            await API.graphql(graphqlOperation(mutations.createBloglike, {input: {bid:(blognum+1), identityid:this.state.identityid, likes: '0', anonymous: String(this.state.anonymous) } }))
            
            this.props.navigation.push('MainFeedPage')
        }
    } catch (err) {
        console.log('failed to create blog')
        console.log(err)
    }
    
  }

  onChange = (key, value) => {
    this.setState({ [key]: value })
  }

 
toggleSwitch=()=> {
  // if(this.state.anonymous==true){
    this.setState({anonymousswitch:!this.state.anonymousswitch})
     {this.updateanon()}
 }
 
 
   
  updateanon=async()=>{
   if(this.state.anonymous==true){
     await this.setState({
        //anonymousMessage:'Non-Anonymous',
        anonymous:false
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
 } else {
   await this.setState({
      //anonymousMessage:'Anonymous',
      anonymous:true
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
 }
  
    render() {
      let { photo } = this.state

      return (
        <View style={{flex: 1, backgroundColor: 'black'}}>  
          
           <Text style={{color: 'white', fontSize: 20, textAlign: 'center', marginTop: 150, marginBottom: 10 }}>
          Do you want to make an anonymous post? 
          </Text>
           <View style={{marginLeft: 175}}>
          <Switch
          value={this.state.anonymousswitch}
         onValueChange={this.toggleSwitch}
         changeValueImmediately={true}
         renderInsideCircle={() =>  <Text style={{ color: 'red', fontWeight: 'bold'}}> Yes</Text> }
         activeText={'Yes'}
         inActiveText={'Off'}
         backgroundActive={'green'}
         backgroundInactive={'red'}
         circleActiveColor={'green'}
         circleInActiveColor={'red'}
         renderActiveText={false}
         renderInActiveText={false}
                         />
          </View>
          <View> 
          <Kaede
          style={{marginTop: 20}}
          label={'Blog Title'}
          inputPadding={16}  
          onChangeText={blogtitle => {
            this.setState({ blogtitlei:blogtitle })}
          }
          />
    
        <TextInput
        multiline={true}
        onChangeText={eventname => {
          this.setState({ captioni:eventname })}
        }
        onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height })
        }}
        placeholder='Blog Description...'
        placeholderTextColor='white'
        style={[styles.default, {height: Math.max(150, this.state.height)}]}
        value={this.state.EventDetails}
      />
                  
                      </View>    
          
              <TouchableOpacity
                  onPress = {this.uploadToStorage}
                   style={{backgroundColor:'black',   padding: 7, width: 120, height: 40, justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', top: 30, left: 130 }}
                           >
          
                           <Text style = {{color: 'white', fontWeight: '300', textAlign: 'center', fontSize: 14}}> Upload Blog </Text>
                </TouchableOpacity> 
          
         
        </View>
      ) 
    }
  
 
}

  const styles = StyleSheet.create({
    default: {
                   width: 350,
                    height: 150,
                    backgroundColor: '#a9a9a9',
                    marginLeft: 30,
                    padding: 8,
                    color: 'white',
                    borderRadius: 14,
                    marginTop: 30
    },
    actionButtonIcon: {
      fontSize: 30,
      height: 30, 
    },  
    actionButton: {
      marginTop:15,
        paddingTop:45,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
    },
  
    

  });
export default BlogUploadPage;