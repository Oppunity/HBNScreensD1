import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
// import {Ionicons} from '@expo/vector-icons'
import Ionicons from 'react-native-vector-icons/FontAwesome';
// imports from Amplify library
//import { Auth, API, graphqlOperation } from 'aws-amplify'
//import UploadPage from './UploadPage'
//import BlogUploadPage from './BlogUploadPage'
//import MainFeedPage from './MainFeedPage'

class SelectUploadPage extends Component {
  static navigationOptions = {
    headerShown: false
  } 

  render()  
 { 
    return (
        
        <View style={{flex: 1, backgroundColor: 'black'}}>
            
        
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('MainFeedPage') }>
                        
        <Ionicons style = {{marginLeft: 20,color: "white",top: 44, left:-3}} name = "angle-left" size={35} />
                    
        </TouchableOpacity>


<Text style={{color: 'white', marginTop: 325, textAlign: 'center', fontSize: 20}}>Select upload</Text> 
    <TouchableOpacity
      style={styles.Organization}
      activeOpacity = { .5 }
      onPress={() => this.props.navigation.navigate('Upload') }
      >
    <Text style={styles.TextStyle}> Event </Text>
    </TouchableOpacity> 
    <TouchableOpacity
      style={styles.Individual}
      activeOpacity = { .5 }
      onPress={() => this.props.navigation.navigate('BlogUpload') }
      >
    <Text style={styles.TextStyle}> Blog </Text>
    </TouchableOpacity> 
    
        </View>
    )


 }
}

const styles = StyleSheet.create( 
    {
      Organization: {
            height: 60,
            width: 300,
            borderRadius: 50,
            marginLeft: 50,
            marginBottom: 100,
            borderWidth: 2.5,
            paddingTop: 18,
            borderColor: '#fff',
            backgroundColor:'#424242',   
            marginTop: 50
        },
        Individual: {
          height: 60,
          width: 300,
          borderRadius: 50,
          marginLeft: 50,
          marginTop: -50,
          marginBottom: 100,
          borderWidth: 2.5,
          paddingTop: 18,
          borderColor: '#fff',
          backgroundColor:'#6e6e6e',    
      },
        TextStyle: {
          fontSize: 18,
            color:'white',
            textAlign:'center',
            fontWeight: 'normal'
        },
      
    }
)


export default SelectUploadPage; 