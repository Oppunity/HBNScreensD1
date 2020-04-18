import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreenPage from './src/screens/HomeScreenPage';
import EventClickPage from './src/screens/EventClickPage';
import LogInPage from './src/screens/LogInPage';
import MainFeedPage from './src/screens/MainFeedPage';
import SettingPage from './src/screens/SettingPage';
import SignUpPage from './src/screens/SignUpPage';
import UploadPage from './src/screens/UploadPage';
import UserProfilePage from './src/screens/UserProfilePage';
import UserSignUpPage from './src/screens/UserSignUpPage';
import FollowerPage from './src/screens/FollowerPage';
import FollowingPage from './src/screens/FollowingPage';
import SearchPage from './src/screens/SearchPage';
import BlogScreen from './src/screens/BlogScreen';
import SelectUploadPage from './src/screens/SelectUploadPage'
import BlogUploadPage from './src/screens/BlogUploadPage'

const MainFeedTabs = createMaterialTopTabNavigator(  
  {  

      Events: {
          screen: MainFeedPage,
          navigationOptions: 
          {
              title: 'Events'}
           },

      Blog: {
          screen: BlogScreen,
          navigationOptions: 
          {
              title: 'Blogs'}
           },
     
  },
  { 
      tabBarOptions: {  
          activeTintColor: 'cyan',  
          showIcon: true,  
          showLabel:true,  
          style: {  
              backgroundColor:'black'  
          },

          indicatorStyle: {
          backgroundColor: 'cyan',
      },
      },  
  }) 
const FollowerTab = createMaterialTopTabNavigator(  
  {  
      Followers: {
          screen: FollowerPage,
          navigationOptions: 
          {
              title: 'Followers',
              }
           },

      Following: {
          screen: FollowingPage,
          navigationOptions: 
          {
              title: 'Following',
              
              }
           },        
  },
  

  { 
      tabBarOptions: {  
          
          activeTintColor: 'white',  
          showIcon: true,  
          showLabel:true,  
          style: {  
              backgroundColor:'black'  
          },

          indicatorStyle: {
          backgroundColor: 'white',
        },
         headerTintColor: 'white'
                       },
                       tabStyle: {
  height: 50,
},
});
const RootStack = createStackNavigator ( { 
 
  HomeScreen: HomeScreenPage,
  BlogUpload: BlogUploadPage,
  SelectUpload: SelectUploadPage,
  EventClick: EventClickPage,
  LogIn: LogInPage,
  Setting: SettingPage,
  SignUp: SignUpPage,
  Upload: UploadPage,
  UserProfile: UserProfilePage,
  UserSignUp: UserSignUpPage,
  FollowerPage: FollowerPage,
  Search: SearchPage,
  FollowingPage: FollowingPage,
  MainFeedPage:{
    screen: MainFeedTabs,
          navigationOptions: ({navigation}) => {  //destructure the navigation property here 
              return {
                  headerShown: true,
                  headerLeft: () => {null},
                  headerStyle: { backgroundColor: 'black'},
                  headerTitleStyle: { color: 'white' },
                  title: 'HBN',
         
              }
          }
    },
  //redirect:redirect

},
{
  initialRoute: 'HomeScreen',
  defaultNavigationOptions: {
      headerStyle: {
      backgroundColor: '#fff',
  },
  gestureEnabled:false,
  swipeEnabled:false

  
}
}
)

const AppContainer = createAppContainer(RootStack)

class App extends Component {

  render() {


      return (
          <AppContainer/> 
      )
  };
}

export default App; 