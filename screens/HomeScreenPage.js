import React, { Component } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';
import { Auth, API, graphqlOperation} from 'aws-amplify'
import store from '../redux/store/currentuserstore'
import * as queries from '../graphql/queries'

class HomeScreenPage extends Component {
    static navigationOptions = {
        headerShown: false
    }

    constructor(props, context) {
      super(props, context);
      this.state = {
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
      }
      store.subscribe(()=>{this.setState(store.getState())});
    }

    async componentDidMount() {
      try {
        console.log('this.state.email: ', this.state.email)
        console.log('this.state.password: ', this.state.password)
         const user = await Auth.signIn(this.state.email, this.state.password)
         var AllUserData = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { identityid: { eq: this.state.identityid } } } ))
         if(AllUserData.data.listUserinfos.items.length>0){
           this.props.navigation.push('MainFeedPage')
         } else {
           alert('No registered organization or user with these credentials. Please register at the following page.')
           this.props.navigation.push('UserSignUp')
         }
     } catch (err) {
       console.log('error:', err)
     }
    }


/*
async componentDidMount() {
  try {
    const credentials = await Auth.currentCredentials()
    const identityIds = credentials.identityId

    console.log('identityIds: ', identityIds)
    if (identityIds) {
      console.log('User worked')
      this.props.navigation.push('MainFeedPage')  
    }
  } catch (err) {
    console.log('error: ', err)
  }
}
*/

    render()
    {
        return (
            
           
       <View style={styles.BackGround}>
            <Text style={styles.CompanyLogo}> Oppunity </Text>  
         
            <TouchableOpacity
          style={styles.SubmitButtonLogIn}
          activeOpacity = { .5 }
          onPress={() => this.props.navigation.navigate('LogIn') }
          >
            <Text style={styles.TextStyle}> LOGIN </Text>
      </TouchableOpacity> 
  
      
      
      <TouchableOpacity
      style={styles. SubmitButtonSignUp}
      activeOpacity = { .5 }
      onPress={() => this.props.navigation.navigate('SignUp') }
      >
    <Text style={styles.TextStyle}> Sign Up </Text>
    </TouchableOpacity> 

   <Text style={styles.FounderText}> Created by Devin Devlin, Daniel Dayto, Arrion Archie, William Trevena </Text> 
   
        
   </View>

    


        );
     }
}


const styles = StyleSheet.create(
    {
      BackGround: {
        flex: 1, 
        backgroundColor: 'black'
      },

      CompanyLogo: {
        flex: 1, 
        color: 'white', 
        fontSize: normalize(50), 
        paddingTop: normalize(250), 
        textAlign: 'center'
      },
      FounderText: { 
        color: 'white', 
        fontSize: normalize(8), 
        bottom: normalize(50),
        left: normalize(50),
        textAlign: 'center',
        position: 'absolute',
        
      },
      SubmitButtonLogIn: {
        height: normalize(100),
        width: normalize(100),
        borderRadius: normalize(50),
        left: normalize(50),
        bottom: normalize(140),
        borderWidth: normalize(2.5),
        paddingTop: normalize(40),
        borderColor: '#fff',
        backgroundColor:'#0043cf', 
        position: 'absolute'
        
    },

    SubmitButtonSignUp: {
      height: normalize(100),
      width: normalize(100),
      borderRadius: normalize(50),
      left: normalize(225),
      bottom: normalize(140),
      borderWidth: normalize(2.5),
      paddingTop: normalize(40),
      borderColor: '#fff',
      backgroundColor:'#0043cf',  
      position: 'absolute'  
  },

    TextStyle: {
      color:'white',
      textAlign:'center',
  },
    }
    );

export default HomeScreenPage;
