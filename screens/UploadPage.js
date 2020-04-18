import React, {Component} from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity,Switch } from 'react-native';
import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import ActionButton from 'react-native-circular-action-menu';
import { configureAmplify, SetS3Config } from '../awsS3/service';
import { Kaede } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/Ionicons';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations';
import { createOrgEvent } from '../graphql/mutations'
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'


class UploadPage extends Component {
  static navigationOptions = {
    headerShown: false
  } 
  constructor(props)
  {
  super(props)
  this.state = {
    EventName: '', EventTime: '', EventLocation: '', EventDetails: '',
    height: 0, photo: null, IDENTITYID: '', currentUsers: [],orgoruser:'',
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
  store.subscribe(()=>{this.setState(store.getState())})
 store1.default.subscribe(()=>{this.setState(store1.default.getState())})
  }
  componentDidMount = async() => {
    
      console.log("Upload Page" + JSON.stringify(this.state));
      //console.log(this.state.anonymous)
      
  }

  handleChoosePhoto = () => {
    ImagePicker.openPicker({
      allowsEditing: true,
      aspect: [4, 3],
    }).then(image => {
      this.setState({ photo: image })
      console.log(image);
      //Auth.currentCredentials().then(data => console.log(data)).catch(err => console.log(err));
    });

  }

  createEventInfo = async() => {
    try {
      console.log('went to createEventInfo')
      var ProductData = await API.graphql(graphqlOperation(queries.listEventsid ))
      console.log('ProductData.data.listEvents.items.length: ', ProductData.data.listEvents.items.length)
      console.log('ProductData1: ', ProductData.data.listEvents.items)
            var eventnum = 0
            for(let i=0;i<ProductData.data.listEvents.items.length; i++){
                if(Number(ProductData.data.listEvents.items[i].eid.split('r')[0]) > eventnum){
                    eventnum=Number(ProductData.data.listEvents.items[i].eid.split('r')[0])
                } else {}
            }
      console.log('(this.state.photo.path: ',  (this.state.photo.path).split('/').slice(-1)[0])
      await API.graphql(graphqlOperation(mutations.createEvent, {input: {eid:(eventnum+1),
                                                                      ename: this.state.EventName, 
                                                                      cename:String(this.state.EventName.toUpperCase()),
                                                                      etime: this.state.EventTime, 
                                                                      elocation: this.state.EventLocation, 
                                                                      edetails: this.state.EventDetails, 
                                                                      identityid: this.state.identityid, 
                                                                      epicpath: (this.state.photo.path).split('/').slice(-1)[0],
                                                                      //orgoruser:this.state.orgoruser,
                                                                      //postername:'NA',
                                                                      //posterpicid:'NA',
                                                                      anonymous:this.state.anonymous,
                                                                      eida:String(String(this.state.identityid)+String(this.state.anonymous))} }))
    

       console.log('item created!')
       this.props.navigation.push('MainFeedPage')
    } catch (err) {
      console.log('error creating UserInputs...', err)
      Storage.remove((this.state.photo.path).split('/').slice(-1)[0], {level: 'protected'})
    .then(result => console.log('delete pic success: ', result))
    .catch(err => console.log('error deleting pic: ', err));
    }
    /*this.setState({
      currentUsers,
      EventName: '', EventTime: '', EventLocation: '', EventDetails: '',
      })*/
  }
  
  uploadToStorage = async () => {
    try {
      const response = await fetch(this.state.photo.path)
      const blob = await response.blob()
     
      SetS3Config("hbndevinonehbnhbnmac152019-hbndevinom","protected");
      Storage.put( (this.state.photo.path).split('/').slice(-1)[0] , blob, {
        contentType: 'image/jpeg',
      })
      console.log('Image Upload!!!!')
     // this.setState({ photo: null })
      {this.createEventInfo()}
    } catch (err) {
      alert('Failed to upload.')
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
       anonymousMessage:'Non-Anonymous',
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
     anonymousMessage:'Anonymous',
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
      const { photo } = this.state
      return (
        <View style={{flex: 1, backgroundColor: 'black'}}>  
           <TouchableOpacity
       activeOpacity= {0.5}
       onPress={() => this.props.navigation.push('MainFeedPage')}
       >
       <Icon 
       size ={50}
       color='white' 
       name='ios-return-left'
       style={{marginTop: 30, marginLeft: 20, position: 'absolute'}}
    > 
    </Icon>
      </TouchableOpacity>
          
          <Kaede
          style={{marginTop: 100}}
          label={'Event Name'}
          inputPadding={16}  
          onChangeText={v => this.onChange('EventName', v)}
          />
     <Kaede
          style={{marginTop: 10}}
          label={'Time of Event'}
          inputPadding={16}  
          onChangeText={v => this.onChange('EventTime', v)}
          />
   <Kaede
          style={{marginTop: 10}}
          label={'Event Location'}
          inputPadding={16}  
          onChangeText={v => this.onChange('EventLocation', v)}
          />

<TextInput
        multiline={true}
        onChangeText={(EventDetails) => {
            this.setState({ EventDetails })
        }}
        onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height })
        }}
        placeholder='Description of your Event'
        placeholderTextColor='white'
        style={[styles.default, {height: Math.max(150, this.state.height)}]}
        value={this.state.EventDetails}
      />


<View style={{}}>
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
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 50 }}>
        {photo && (
          <Image
            source={{ uri: photo.path }}
            style={{ width: 350, height: 300 }}
          />
        )}
      
      </View>

       
      <ActionButton
             buttonColor="rgba(231,76,60,1)" 
             radius = {120}
             style={styles.actionButton}
             bgColor = 'black'
             btnOutRange = 'black'
             >

          <ActionButton.Item buttonColor='dodgerblue' size = {50} onPress={() => this.props.navigation.push('MainFeedPage')}>
            <Icon name="ios-return-left" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>

          <ActionButton.Item buttonColor='orangered' size = {50} onPress={this.handleChoosePhoto}>
            <Icon name="ios-add-circle-outline" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>

          <ActionButton.Item buttonColor='magenta' size = {50} onPress={this.uploadToStorage}>
            <Icon name="ios-return-right" style={styles.actionButtonIcon}/>
          </ActionButton.Item>

          

          
          

            </ActionButton>
  
  
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
export default UploadPage;