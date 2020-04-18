import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import normalize from 'react-native-normalize';


class SettingPage extends Component {
 render()  
 { 
    return (
        <View style={{flex: 1, backgroundColor: 'black'}}> 
             <TouchableOpacity
      style={styles.SubmitButtonSignUp}
      activeOpacity = { .5 }
      >
    <Text style={styles.TextStyle}> SettingPage </Text>
    </TouchableOpacity> 

        </View>


    )


 }
}

const styles = StyleSheet.create( 
    {
        SubmitButtonSignUp: {
            height: normalize(100),
            width: normalize(100),
            borderRadius: normalize(50),
            marginLeft: normalize(225),
            marginBottom: normalize(100),
            borderWidth: normalize(2.5),
            paddingTop: normalize(40),
            borderColor: '#fff',
            backgroundColor:'#0043cf',    
        },
        TextStyle: {
            color:'white',
            textAlign:'center',
        },
      
    }
)

export default SettingPage; 