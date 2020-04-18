import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, PixelRatio } from 'react-native';

// imports from Amplify library
import { Storage, Auth, API, graphqlOperation, Amplify } from 'aws-amplify'
//import Storage from '@aws-amplify/storage'
//import Auth from '@aws-amplify/auth'
// import the GraphQL query
//import { listUserInfos } from '../graphql/queries'

// import the GraphQL mutation
import { createUserInfo, createUserPic } from '../graphql/mutations'

// create client ID
//import uuid from 'uuid/v4'
//const CLIENTID = uuid()
import ImagePicker from 'react-native-image-crop-picker';
import { ScrollView } from 'react-native-gesture-handler';
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations';
import DropdownMenu from 'react-native-dropdown-menu';
import DatePicker from 'react-native-datepicker'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import { SetS3Config } from '../awsS3/service';
import store from '../redux/store/currentuserstore'
//import awsmobile from '../../aws-exports'
//Storage.configure(awsmobile)
//Auth.configure(awsmobile)
//Amplify.configure(awsmobile)
//Storage.vault._config.AWSS3.level='protected'


class UserSignUpPage extends React.Component {
 static navigationOptions = {
 headerShown: false
}
 // add additional state to hold form state as well as UserInput data returned from the API

 constructor() {
 super();
 this.state = {
  email: store.getState().email,
  password: store.getState().password, 
  identityid: store.getState().identityid,
  id:store.getState().id,
  username: '', 
  cusername:'',
  ausername: '',
  causername:'',
  firstname: '',
  lastname: '', 
  incollege: '', 
  collegename: '', 
  major: '', 
  race: 'Black',
  gender: 'Male', 
  birthday: null, 
  country: '', 
  userpicselect:false,
  auserpicselect:false,
  userpic:'genericprofilepic.png',
  auserpic:'genericprofilepic.png',
  userbio:'',
  auserbio:'',
  photo:'',
  aphoto:'',
  //utypeswitch:false,
  utype:'user',
  orgname:'NA',
  utypeselect:'',
  currentuser: [], 
  currentUserPic: []
 };
 store.subscribe(()=>{this.setState(store.getState())});
 }


 
 // execute the query in componentDidMount
 componentDidMount = async() => {
  console.log("App subscribe this.state:" + JSON.stringify(this.state));
 try {
 const credentials = await Auth.currentCredentials()
 const identityIds = credentials.identityId
 this.state.identityid = identityIds
 } catch (error) {
 console.log(error)
 } 
 }


 toggleSwitch = () => {
 this.setState({ incollege: !this.state.incollege });
 };
 
 toggleSwitch1 = () => {
 if(this.state.utype=='user'){
 this.setState({ utype: 'org',utypeselect:true });

 } else {
 this.setState({ utype: 'user',utypeselect:false });
 } 
 };

 
 handleChoosePhoto = () => {
 ImagePicker.openPicker({
 allowsEditing: true,
 aspect: [4, 3],
 }).then(image => {
 this.setState({ photo: image,userpicselect:true })
 console.log('photo: ', this.state.photo);
 //Auth.currentCredentials().then(data => console.log(data)).catch(err => console.log(err));
 
 });

 }
 handleChoosePhotoA = () => {
 ImagePicker.openPicker({
 allowsEditing: true,
 aspect: [4, 3],
 }).then(image => {
 this.setState({ aphoto: image,auserpicselect:true })
 console.log('aphoto: ', this.state.aphoto);
 //Auth.currentCredentials().then(data => console.log(data)).catch(err => console.log(err));

 });

}
 
 uploadToStorage = async () => {
 try {
 if(this.state.userpicselect==false){
 const response = await fetch('http://interreligio.unistra.fr/wp-content/uploads/2017/07/profil-vide-300x300.png')
 const blob = await response.blob()
 SetS3Config("hbndevinonehbnhbnmac152019-hbndevinom", "protected");
 Storage.put(('genericprofilepic.png'), blob, {
 contentType: 'image/png',
 level: 'protected'
 })
 await this.setState({userpic:'genericprofilepic.png'})

 } else {
 const response = await fetch(this.state.photo.path)
 const blob = await response.blob()
 SetS3Config("hbndevinonehbnhbnmac152019-hbndevinom","protected");
 Storage.put( (this.state.photo.path).split('/').slice(-1)[0] , blob, {
 contentType: 'image/jpeg',
 })
 await this.setState({userpic:((this.state.photo.path).split('/').slice(-1)[0])})
 }




 if(this.state.auserpicselect==false){
 const response = await fetch('http://interreligio.unistra.fr/wp-content/uploads/2017/07/profil-vide-300x300.png')
 const blob = await response.blob()
 SetS3Config("hbndevinonehbnhbnmac152019-hbndevinom", "protected");
 Storage.put(('genericprofilepic.png'), blob, {
 contentType: 'image/png',
 level: 'protected'
 })
 await this.setState({auserpic:'genericprofilepic.png'})

 } else {
 const response = await fetch(this.state.aphoto.path)
 const blob = await response.blob()
 SetS3Config("hbndevinonehbnhbnmac152019-hbndevinom","protected");
 Storage.put( (this.state.aphoto.path).split('/').slice(-1)[0] , blob, {
 contentType: 'image/jpeg',
 })
 await this.setState({auserpic:((this.state.aphoto.path).split('/').slice(-1)[0])})
 }


 await API.graphql(graphqlOperation(mutations.createUserpic, {input: {identityid:this.state.identityid,userpic:this.state.userpic,auserpic:this.state.auserpic} }))
 
 

 } catch (err) {
 alert('Failed to upload.')
 console.log(err)
 }
 }

 // this method calls the API and creates the mutation
 
 
 
 createUserInfo = async() => {
 if ((this.state.utype === 'org') && (this.state.orgname ==='NA')) {
 alert('You have indicated that you are an organization without entering an organization name')
 return
 }
 if ((this.state.utype === 'user') && (this.state.orgname !='NA')) {
 alert('You have not indicated that you represent an organization but you have entered an orgname. If you represent an organization, please select that you are an org. If you do not represent an org, please delete the orgname that you have entered and input "NA".')
 return
 }
 if (this.state.username === '') {
 alert('You must enter a username')
 return
 }
 if (this.state.ausername === '') {
 alert('You must enter an anonymous username')
 return
 }
 if (this.state.firstname === '') {
 alert('You must enter first name')
 return
 }
 if (this.state.lastname === '') {
 alert('You must enter in a last name')
 return
 }
 if (this.state.birthday === null) {
 alert('You must enter in a date of birth')
 return
 }
 if (this.state.userbio === '') {
 alert('You must enter in a non-anonymous user bio')
 return
 }
 if (this.state.auserbio === '') {
 alert('You must enter in an anonymous user bio')
 return
 }
 if (this.state.country.name === undefined ) {
 alert('You must pick a country of origin')
 return
 }
 if ( (this.state.incollege === true) && ((this.state.collegename === '') || (this.state.major === ''))) {
 alert('If you are in college then you must enter in your college name and major')
 return
 }
 alert('Please wait until you are directed back to the login page. Your account is now being set up.')
 if (this.state.incollege === '' || this.state.incollege === 'false' ) {
 this.state.incollege = false
 this.state.major = 'NA'
 this.state.collegename = 'NA'
 }

 //var { username, firstname, lastname, incollege, collegename, major, racetext, gendertext, date, country } = this.state
 // store the UserInput data in a variable
 /*const userinput = {
 username , firstname, lastname, InCollege, collegename, major, RaceText, GenderText, date, country: country.name, identityId: this.state.IDENTITYID, UserPicture: 'genericprofilepic.png', userBio: 'CHANGE YOUR USER BIO'
 }
 // perform an optimistic response to update the UI immediately
 const currentUser = [...this.state.currentUser, UserInput]
 this.setState({
 currentUser,
 userName: '', firstname: '', lastname: '', InCollege: '', collegename: '', major: '', RaceText: 'Black', GenderText: 'Male', date: null, country: ''
 })*/
 
 try {
 /*console.log(this.state.userName)
 console.log(this.state.firstname)
 console.log(this.state.lastname)
 console.log(this.state.InCollege)
 console.log(this.state.major)
 console.log(this.state.collegename)
 console.log(this.state.RaceText)
 console.log(this.state.GenderText)
 console.log(this.state.date)
 console.log(this.state.country.name) 
 console.log(this.state.IDENTITYID)*/
 // make the API call
 //await API.graphql(graphqlOperation(createUserInfo, {
  await API.graphql(graphqlOperation(mutations.createFollow, {input: 
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
          }}))


 {await this.uploadToStorage()} 
 await API.graphql(graphqlOperation(mutations.createUserinfo, {input: 
 {identityid:this.state.identityid,
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
 country:this.state.country.name,
 userpic:this.state.userpic,
 userbio:this.state.userbio,
 utype:this.state.utype,
 auserbio:this.state.auserbio,
 auserpic:this.state.auserpic,
 orgname:this.state.orgname}}))

 var AllUserData = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { identityid: { eq: this.state.identityid } } } ))
 await this.setState({id:AllUserData.data.listUserinfos.items[0].id})



 
 await store.dispatch({
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
 country:this.state.country.name,
 userpic:this.state.userpic,
 userbio:this.state.userbio,
 utype:this.state.utype,
 auserbio:this.state.auserbio,
 auserpic:this.state.auserpic,
 orgname:this.state.orgname,
 email:this.state.email,
  password:this.state.password, 
id:this.state.id,
anonymous:false,
 }});
 this.props.navigation.navigate('LogIn')
 //console.log('item created!')
 
 } catch (err) {
 console.log('error creating UserInput...', err)
 }
 
 }
 // change form state then user types into input
 onChange = (key, value) => {
 this.setState({ [key]: value })
 }
 render() {

 var Race = [[ "Black", "White", "Asian", "Hispanic", "Pacific Islander","Prefer not to say"]];
 var Gender = [["Male", "Female", "Prefer not to say"]];

 return (
 <ScrollView style={{backgroundColor: 'black'}}> 


 <View style={{flex: 1, backgroundColor: 'black', width: '100%', height: '100%'}}>
 
 <Text style={{marginTop: 40, fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: 'white'}}> 
 Account Information Sign Up Page
 </Text>
 <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, marginTop: 1 }}/>

 <Text style={{marginTop: 20, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input Your Username for your Non-Anonymous Account
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='username'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({username: v})
 }}
 value={this.state.userName}
 />
 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />




<Text style={{marginTop: 5, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input your Bio for your Non-Anonymous Account
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='non-anonymous bio'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({userbio: v})
 }}
 value={this.state.userbio}
 />

<View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>














 <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, marginTop: 1 }}/>

 <Text style={{marginTop: 20, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input Your Anonymous Username
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='anonymous username'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({ausername: v})
 }}
 value={this.state.ausername}
 />
 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />
 <Text style={{marginTop: 5, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input your Bio for your Anonymous Account
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='anonymous bio'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({auserbio: v})
 }}
 value={this.state.auserbio}
 />

 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />

<Text style={{marginTop: 20, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input your First Name
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='first name'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({firstname: v})
 }}
 value={this.state.firstname}
 />
 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />


<Text style={{marginTop: 5, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input your Last Name
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='last name'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({lastname: v})
 }}
 value={this.state.lastname}
 />

 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />

 <Text style={{color: 'white', fontSize: 20, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
 Are you representing an organization? 
 </Text>
 <View style={{marginLeft: 175}}>
 <Switch
 value={this.state.utypeselect}
 onValueChange={this.toggleSwitch1}
 changeValueImmediately={true}
 renderInsideCircle={() => <Text style={{ color: 'red', fontWeight: 'bold'}}> Yes</Text> }
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

 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />

 <Text style={{marginTop: 5, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 Input the name of your organization (Leave blank if you have not selected the button above indicating that you are an organization)
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='org name'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({orgname: v})
 }}
 value={this.state.orgname}
 />

 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />


 <Text style={{color: 'white', fontSize: 20, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
 Are you in college? 
 </Text>
 <View style={{marginLeft: 175}}>
 <Switch
 value={this.state.incollege}
 onValueChange={this.toggleSwitch}
 changeValueImmediately={true}
 renderInsideCircle={() => <Text style={{ color: 'red', fontWeight: 'bold'}}> Yes</Text> }
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

 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />


 <Text style={{marginTop: 5, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 If you are in college input your full college name
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='college name'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({collegename: v})
 }}
 value={this.state.collegename}
 />

 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
 />


 <Text style={{marginTop: 5, fontSize: 20, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> 
 What is your major?
 </Text>
 <TextInput
 style={{ width: 350,
 height: 55,
 backgroundColor: '#a9a9a9',
 marginLeft: 30,
 padding: 8,
 color: 'white',
 borderRadius: 14,
 marginTop: 10}}
 placeholder='major'
 autoCapitalize="none"
 placeholderTextColor='white'
 onChangeText={v => {
 this.setState({major: v})
 }}
 value={this.state.major}
 />

<View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>



<TouchableOpacity style={{width:'60%',height:55,borderColor:'white'}} onPress = {()=>{
 {this.handleChoosePhoto()}
}}>
 <Text style={{marginTop: 5, fontSize: 10, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> Click this button if you want to select a custom profile picture for your non-anonymous account</Text>
</TouchableOpacity>

<View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>

<View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>



<TouchableOpacity style={{width:'60%',height:55,borderColor:'white'}} onPress = {()=>{
 {this.handleChoosePhotoA()}
}}>
 <Text style={{marginTop: 5, fontSize: 10, textAlign: 'center', fontStyle: 'italic', color: 'white'}}> Click this button if you want to select a custom profile picture for your anonymous account</Text>
</TouchableOpacity>

<View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>



<Text style={{textAlign: 'center', fontSize: 20, fontStyle: 'italic', color: 'white', marginTop: 5}}> 
 Select your race
 </Text>

<View style={{height: 20 }} />
 <DropdownMenu
 
 style={{flex: 1}}
 bgColor={'#a9a9a9'}
 tintColor={'black'}
 activityTintColor={'green'}
 // arrowImg={} 
 // checkImage={} 
 //optionTextStyle={{color: 'black'}}
 titleStyle={{color: 'black'}} 
 // maxHeight={300} 
 handler={(selection, row) => this.setState({race: Race[selection][row]})}
 data={Race}
 >
 </DropdownMenu>
 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 230
 }}
/>


<Text style={{textAlign: 'center', fontSize: 20, fontStyle: 'italic', color: 'white', marginTop: 5}}> 
 Select your Gender
 </Text>

<View style={{height: 10, marginTop: 5 }} />
 <DropdownMenu
 style={{flex: 1}}
 bgColor={'#a9a9a9'}
 tintColor={'black'}
 activityTintColor={'green'}
 // arrowImg={} 
 // checkImage={} 
 //optionTextStyle={{color: 'black'}}
 titleStyle={{color: 'black'}} 
 // maxHeight={300} 
 handler={(selection, row) => this.setState({gender: Gender[selection][row]})}
 data={Gender}
 >
 </DropdownMenu>
 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 180
 }}
/>


<Text style={{ marginBottom: 10,textAlign: 'center', fontSize: 20, fontStyle: 'italic', color: 'white', marginTop: 10}}> 
 Select your date of birth
 </Text>
 
 
 <DatePicker
 style={{width: 200, marginBottom: 10, marginLeft: 100, backgroundColor: 'white', marginTop: 10 }}
 date={this.state.date}
 mode="date"
 placeholder="select date"
 format="YYYY-MM-DD"
 minDate="1800-01-01"
 // maxDate="2020-01-01"
 confirmBtnText="Confirm"
 cancelBtnText="Cancel"
 // showIcon={false}
 // customStyles={{
 // dateIcon: {
 // position: 'absolute',
 // left: 0,
 // top: 4,
 // marginLeft: 0
 // },
 // dateInput: {
 // marginLeft: 36
 // }
 // ... You can check the source to find the other keys.
 // }}
 onDateChange={(date) => {this.setState({birthday: date})}}
 />
 
 <View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>
<Text style={{ marginBottom: 10,textAlign: 'center', fontSize: 20, fontStyle: 'italic', color: 'white', marginTop: 10}}> 
 Which country are you from?
 </Text>





 <CountryPicker
 
 onSelect={(value)=> this.setState({country: value})}
 translation='eng'
 withAlphaFilter={true}
 withEmoji={true}
 containerButtonStyle={{marginLeft: 150}}

 theme={DARK_THEME}

 />
 
 {this.state.country.name &&
 <Text style={{ width: '50%',
 padding: 10,
 marginTop: 7,
 fontSize: 20,
 marginLeft: 100,
 textAlign: 'center',
 backgroundColor: 'black',
 borderColor: 'red',
 borderWidth: 1 / PixelRatio.get(),
 fontWeight: 'bold',
 color: 'white'}}>
 {JSON.stringify(this.state.country.name, null, 2)}
 </Text>
 }

<View
 style={{
 borderBottomColor: 'gray',
 borderBottomWidth: 0.5,
 marginTop: 10
 }}
/>

<TouchableOpacity 
 onPress={this.createUserInfo}
 style ={{ height: 50,
 width: 200,
 borderRadius: 25,
 borderWidth: 2.5,
 borderColor: '#fff',
 backgroundColor: '#0043cf',
 borderRadius: 25,
 marginVertical: 10,
 paddingTop: 15, 
 marginTop: 40,
 marginLeft: 100 }}> 
 
 <Text style = {{ fontSize: 16,fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginTop: -1}}> Sign Up</Text>
 </TouchableOpacity>


 </View>
 </ScrollView> 
 )
 }
}

export default UserSignUpPage;