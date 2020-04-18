import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
// imports from Amplify library
import { Auth, API, graphqlOperation } from 'aws-amplify'

class AccountSelectPage extends Component {
  static navigationOptions = {
    headerShown: false
  } 

  render()  
 { 
    return (
        <View style={{flex: 1, backgroundColor: 'black'}}>
<Text style={{color: 'white', marginTop: 325, textAlign: 'center', fontSize: 20}}>Select the type of account you are creating?</Text> 
    <TouchableOpacity
      style={styles.Organization}
      activeOpacity = { .5 }
      onPress={() => this.props.navigation.navigate('OrgSignUp') }
      >
    <Text style={styles.TextStyle}> Orgaization </Text>
    </TouchableOpacity> 
    <TouchableOpacity
      style={styles.Individual}
      activeOpacity = { .5 }
      onPress={() => this.props.navigation.navigate('UserSignUp') }
      >
    <Text style={styles.TextStyle}> Individual </Text>
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


export default AccountSelectPage; 