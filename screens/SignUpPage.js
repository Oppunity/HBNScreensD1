import Ionicons  from 'react-native-vector-icons/Ionicons';
import React, { Fragment, Component } from 'react'
import {TouchableWithoutFeedback, Keyboard, View, Button, TextInput, StyleSheet, Image, TouchableOpacity, Text, KeyboardAvoidingView} from 'react-native'
import normalize from 'react-native-normalize'
import PhoneInput from 'react-native-phone-input'
import { Auth } from 'aws-amplify'
import store from '../redux/store/currentuserstore'

const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>
        {children}
      </Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(View)



const initialState = {
    username: '', password: '',  phone_number: '', authenticationCode: '', showConfirmationForm: false
  }
  
class SignUpPage extends Component {
    
    static navigationOptions = {
        headerShown: false
    }

    state = initialState
    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }
    
    constructor() {
      super();
  
      this.state = {
        pressed: false,
        phone_number: "",
        id:store.getState().id,
        email: store.getState().email,
        password: store.getState().password, 
       identityid: store.getState().identityid,
        username:'NA',
        userbio:'NA',
        userpic:'NA',
        ausername:'NA',
        causername:'NA',
        cusername:'NA',
        auserbio:'NA',
        auserpic:'NA',
        firstname:'NA',
        lastname:'NA',
        collegename:'NA',
        incollege:'NA',
        major:'NA',
        race:'NA',
        gender:'NA',
        birthday:'NA',
        country:'NA',
        utype:'NA',
        orgname:'NA',

      };
      store.subscribe(()=>{this.setState(store.getState())});
      this.updateInfo = this.updateInfo.bind(this);
    }
    async componentDidMount() {
      console.log("App subscribe this.state:" + JSON.stringify(this.state));
      try {
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
      
      //console.log(this.state.IDENTITYID)
  }
    updateInfo() {
      this.setState({
        phone_number: this.number.getValue()
      });
    }
  
    isEmailValid = async() => {
      if (!this.pressed){
      let email = this.state.username
      let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      let correctEmail = pattern.test(String(email).toLowerCase())
      if (correctEmail === true) {
       // console.log(correctEmail)
       await this.setState({pressed:true})
       console.log('this.state.pressed: ', this.state.pressed)
        {this.signUp()}
      }
      else {
       // console.log(correctEmail)
       await this.setState({pressed:true})
        alert('Please input a valid email.')
        
      }
    }
  }

    signUp = async () => {
      const { username, password, email, phone_number } = this.state
      if ( this.state.password === 'NA' || this.state.username === 'NA' || this.state.username.length === 0 || this.state.password.length < 8  || !(/([A-Z]+)/g.test(password)) || !(/([a-z]+)/g.test(password)) || !(/([0-9]+)/g.test(password))){
            await this.setState({pressed:false})
            console.log('this.state.pressed: ', this.state.pressed)
            alert('Please make sure you have entered a valid email address and a password of at least 8 characters (with at least one number, lowercase, and capital letter).');

        return
      }

    
      try {
        await this.setState({password:password,email:username})
        const success = await Auth.signUp({ username, password, attributes: { phone_number: this.state.phone_number }})
        //console.log('user successfully signed up!: ', success)
        this.setState({ showConfirmationForm: true })
      } catch (err) {
        await this.setState({pressed:false})
        console.log('this.state.pressed: ', this.state.pressed)
        alert('A user with this email address already exists.')
        console.log('error signing up: ', err)
      }
    }

    
    confirmSignUp = async () => {
      const { username, password, authenticationCode } = this.state
      try {
        await Auth.confirmSignUp(username, authenticationCode) 
        //console.log('successully signed up!') 
        alert('User signed up successfully!')

        //await Auth.signIn(username, password)
        const user = await Auth.signIn(username, password)
        alert('user successfully signed in!'); 
        /*console.log('USER IS THIS PERSON????     ',user)
        
        console.log('CURRENT CREDENTIALS              ',credentials)
       // console.log('user successfully signed in!', user)
       console.log('user successfully signed in! ')
        
        
        
        this.setState({ ...initialState })*/
        const credentials = await Auth.currentCredentials()
        var identityid =credentials.identityId
        console.log('                PASSWORD & EMAIL      '+this.state.email+this.state.password)
        await store.dispatch({ type: "signin",
        payload: {id:'NA',
                   identityid:identityid,
                   username:'NA',
                   cusername:'NA',
                   causername:'NA',
                   userbio:'NA',
                   userpic:'NA',
                   ausername:'NA',
                   auserbio:'NA',
                   auserpic:'NA',
                   firstname:'NA',
                   lastname:'NA',
                   collegename:'NA',
                   incollege:'NA',
                   major:'NA',
                   race:'NA',
                   gender:'NA',
                   birthday:'NA',
                   country:'NA',
                   utype:'NA',
                   orgname:'NA',
                   email:this.state.email,
                   password: this.state.password, 
                  anonymous:false} });
        this.props.navigation.push('UserSignUp')
      } catch (err) {
        console.log('error confirming signing up: ', err)
      }
    }
    


    render() {
      return (
        
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
        <DismissKeyboardView>
        <View style={styles.container}>
        <TouchableOpacity
       activeOpacity= {0.5}
       onPress={() => this.props.navigation.push('LogIn')}
       >
       <Ionicons 
       size ={50}
       color='white' 
       name='ios-return-left'
       style={{marginTop: -100, marginLeft: -175, position: 'absolute'}}
    > 
    </Ionicons>
      </TouchableOpacity>
          {
            !this.state.showConfirmationForm && (
              <Fragment>
                <Image 
         style = {{width: 250, height: 250, marginBottom:50}}
         source = {{uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/08/University_of_San_Diego_seal.svg/1200px-University_of_San_Diego_seal.svg.png'}}
      />
      
                
                <PhoneInput
                  style={styles.input}
                  ref={ref => {
                    this.number = ref;
                  }}
                  textProps= {{placeholder: 'Phone Number (optional)', placeholderTextColor:'white'}}
                  textStyle= {{color: 'white'}}


                  onChangePhoneNumber= {this.updateInfo}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder='Email'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={val => this.onChangeText('username', val)}
                  
                />
                <TextInput
                  style={styles.input}
                  placeholder='Password'
                  secureTextEntry={true}
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={val => this.onChangeText('password', val)}
                />
                


        
       
                {/*<Text style = {{ fontSize: 15,fontWeight: '500', color: '#ffffff', textAlign: 'center', marginTop: -1}}>Email is required</Text>{*/}
            <TouchableOpacity 
                        onPress={this.isEmailValid}
                        style ={{   height: normalize(50),
                          width: normalize(200),
                          borderRadius: normalize(25),
                          borderWidth: normalize(2.5),
                          borderColor: '#fff',
                            backgroundColor: '#0043cf',
                            borderRadius: 25,
                            marginVertical: 10,
                            paddingVertical: 16, 
                            marginTop: 30, 
                            }}> 
               
            <Text style = {{ fontSize: 16,fontWeight: '500', color: '#ffffff', textAlign: 'center', marginTop: -1}}> Sign Up</Text>
       </TouchableOpacity>
       <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('LogIn') }
                        style ={{height: normalize(50),
                          width: normalize(200),
                          borderRadius: normalize(25),
                          borderWidth: normalize(2.5),
                          borderColor: '#fff',
                            backgroundColor: 'grey',
                            borderRadius: 25,
                            marginVertical: 10,
                            paddingVertical: 15, 
                            }}> 
               
            <Text style = {{ fontSize: 16,fontWeight: '500', color: '#ffffff', textAlign: 'center', marginTop: -1}}> Login</Text>
       </TouchableOpacity>
              </Fragment>
            )
          }
          {
            this.state.showConfirmationForm && (
              <Fragment>
                <TextInput
                  style={styles.input}
                  placeholder='Authentication code'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={val => this.onChangeText('authenticationCode', val)}
                />
                <Button
                  title='Confirm Sign Up'
                  onPress={this.confirmSignUp}
                />
              </Fragment>
            )
          }
        </View>
</DismissKeyboardView>
</KeyboardAvoidingView>

      )
    }
  }
  
  const styles = StyleSheet.create({
    input: {
      width: 350,
      height: 55,
      backgroundColor: '#a9a9a9',
      margin: 10,
      padding: 8,
      color: 'white',
      borderRadius: 14,
      marginTop: 10
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    },
    info: {
      // width: 200,
      borderRadius: 5,
      backgroundColor: "#f0f0f0",
      padding: 10,
      marginTop: 20
    },
    button: {
      marginTop: 20,
      padding: 10
    }
  })

export default SignUpPage; 