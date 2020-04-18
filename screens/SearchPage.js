import React, {Component} from 'react';  
import {View,Text, StyleSheet,  FlatList, Dimensions, Image, TouchableOpacity, ActivityIndicator} from 'react-native';  
import {Button} from 'native-base'
import { Header, SearchBar } from 'react-native-elements'; 
//import Icon from 'react-native-vector-icons/FontAwesome5';
import ActionButton from 'react-native-circular-action-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries'
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'
var {width, height} = Dimensions.get('window')

class SearchPage extends Component{  
    static navigationOptions = {
  // Hide the header from AppNavigator stack
  title: 'Title',
};
constructor(props) {
  super(props);
  this.state = {
    smash:0,
 heat :0,
 looseness :0,
 thickness :0,
 intelligence :0,
 savageness :0,
 ratchetness :0,
 diversity :0,
    search: '',
    activeIndex: 0,
    t0c:'#42a5f5',
    t1c:'white',
    t2c:'white',
    t3c:'white',
    IDENTITYID:'',
    srnames:[],
    srids:[],
    SearchUserPic: [],
    orgimage: [],
    orgpicname: '',
    flatlistheight: '82%',
    flatlisttop: '12%',
    sUser:{},
    orgoruser:'',
    cUser:[],
    cUsername:'',
    cUserpic:'',
    CurrentIDENTITYID:'',
    isFetching: false,
    searchr:{},
    anonymous:'',
  };
  store.subscribe(()=>{this.setState(store.getState())});
  store1.default.subscribe(()=>{this.setState(store1.default.getState())})
}

  async componentDidMount() {
        /*const credentials = await Auth.currentCredentials()
        const identityIds = credentials.identityId
        this.state.IDENTITYID = identityIds
        this.state.CurrentIDENTITYID = identityIds
        
            var userquery = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { identityid: { eq: this.state.CurrentIDENTITYID } } } ))
            //console.log(AllUserData.data.listUserInfos.items[0])
            if(userquery.data.listUserinfos.items.length>0){
            this.setState({orgoruser:'user',cUser:userquery.data.listUserinfos.items[0],cUsername:userquery.data.listUserinfos.items[0].username,cUserpic:userquery.data.listUserinfos.items[0].userpic})
            console.log('user')
            } else {
            alert('Error')
            }*/
     }

  updateSearch = async(search) => {
    
    this.setState({ search }, async function() {
    //this.setState({search:String(this.state.search)})
    if(this.state.activeIndex==0) {
      await this.setState({ isFetching: true });
      if (search.length===0){this.setState({searchr:[],currentUser:[],srnames:[],srids:[],SearchUserPic:[],orgimage:[],orgpicname:'',flatlistheight:'0%', flatlisttop: '-50%',isFetching:false})}
          else {
                var AllUserData = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { causername: {beginsWith:String(search)}  }} ))
                await this.setState({flatlistheight:'82%', flatlisttop: '20%',currentUser: AllUserData.data.listUserinfos.items})
                for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                    this.state.currentUser[i].fname='HBN'
                    this.state.currentUser[i].lname="ANONYMOUS"
                    this.state.currentUser[i].uname=this.state.currentUser[i].ausername
                    this.state.currentUser[i].anonymous=true                   
                }
                await Promise.all([
                      this.auserpic(),
                      this.rating()
                    ])
                this.setState({ isFetching: false }) 

      
            }
    }else if(this.state.activeIndex==1){
        await this.setState({ isFetching: true });
        if (search.length===0){this.setState({searchr:[],currentUser:[],srnames:[],srids:[],SearchUserPic:[],orgimage:[],orgpicname:'',flatlistheight:'0%', flatlisttop: '-50%',isFetching:false})}
        else {
                  var AllUserData = await API.graphql(graphqlOperation(queries.listUserinfos, { filter: { cusername: {beginsWith:String(search)}  }} ))
                  await this.setState({flatlistheight:'82%', flatlisttop: '20%',currentUser: AllUserData.data.listUserinfos.items})
                  for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                    this.state.currentUser[i].fname=this.state.currentUser[i].firstname
                    this.state.currentUser[i].lname=this.state.currentUser[i].lastname
                    this.state.currentUser[i].uname=this.state.currentUser[i].username
                    this.state.currentUser[i].anonymous=false  
                  }
                  await Promise.all([
                    this.userpic(),
                    this.rating()
                  ])
                  this.setState({ isFetching: false }) 
        }
    }else if(this.state.activeIndex==2){

    }})
  };
  
  userpic =async()=>{
    for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
      var UserPic = await API.graphql(graphqlOperation(queries.listUserpics, { filter: { identityid: { eq: this.state.currentUser[i].identityid }}}))
      await Storage.get(UserPic.data.listUserpics.items[0].userpic, {level: 'protected',identityId:this.state.currentUser[i].identityid})
          .then(async data => {
          this.state.currentUser[i].img=data
        })
      }
      return Promise
  }
  auserpic =async()=>{
    for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
      var UserPic = await API.graphql(graphqlOperation(queries.listUserpics, { filter: { identityid: { eq: this.state.currentUser[i].identityid }}}))
      await Storage.get(UserPic.data.listUserpics.items[0].auserpic, {level: 'protected',identityId:this.state.currentUser[i].identityid})
          .then(async data => {
          this.state.currentUser[i].img=data
        })
      }
      return Promise
  }


  segmentClicked = async(index) => {
    this.setState({
    activeIndex: index
    },async function(){
    {this.updateSearch(this.state.search)}
    if(this.state.activeIndex==0){await this.setState({t0c:'#42a5f5',t1c:'white',t2c:'white',anonymous:true})
    }else if(this.state.activeIndex==1){await this.setState({t0c:'white',t1c:'#42a5f5',t2c:'white',anonymous:false})
    }else if(this.state.activeIndex==2){await this.setState({t0c:'white',t1c:'white',t2c:'#42a5f5',t3c:'white',})
    }else if(this.state.activeIndex==3){await this.setState({t0c:'white',t1c:'white',t2c:'white',t3c:'#42a5f5'})}})
  }


  rating=async()=>{
    for(let k=0;k<this.state.currentUser.length; k++){ 

       var cratings = await API.graphql(graphqlOperation(queries.listProfileratingss, { filter: { ratedid: { eq: this.state.currentUser[k].identityid },rateda: { eq: String(this.state.currentUser[k].anonymous) } } } ))
       var cratings =cratings.data.listProfileratingss.items
         var total=Number(cratings.length)
         /*var smash=0
         var heat=0
         var looseness=0
         var thickness =0
         var intelligence =0
         var savageness =0
         var ratchetness=0
         var diversity=0*/
         for (var i = 0; i < cratings.length; i++) {
           var smash =smash+Number(cratings[i].smash)
           var heat=Number(cratings[i].heat)
            var looseness=Number(cratings[i].looseness)
            var thickness =Number(cratings[i].thickness)
            var intelligence =Number(cratings[i].intelligence)
            var savageness =Number(cratings[i].savageness)
            var ratchetness=Number(cratings[i].ratchetness)
            var diversity=Number(cratings[i].diversity)
           await this.setState({smash:Number(this.state.smash)+Number(cratings[i].smash),
                         heat:Number(this.state.heat)+Number(cratings[i].heat),
                         looseness:Number(this.state.looseness)+Number(cratings[i].looseness),
                         thickness:Number(this.state.thickness)+Number(cratings[i].thickness),
                         intelligence:Number(this.state.intelligence)+Number(cratings[i].intelligence),
                         savageness:Number(this.state.savageness)+Number(cratings[i].savageness),
                         ratchetness:Number(this.state.ratchetness)+Number(cratings[i].ratchetness),
                         diversity:Number(this.state.diversity)+Number(cratings[i].diversity)
           })
       }
       /*this.state.currentUser[k].rating="Rating: "+((((smash/total)*25)+
                                 ((heat/total)*15)+
                                 ((looseness/total)*15)+
                                 ((thickness/total)*15)+
                                 ((intelligence/total)*10)+
                                 ((savageness/total)*10)+
                                 ((ratchetness/total)*5)+
                                 ((diversity/total)*5))/100)*/
       this.state.currentUser[k].rating="Rating: "+Math.round((((this.state.smash/total)*25)+
                                 ((this.state.heat/total)*15)+
                                 ((this.state.looseness/total)*15)+
                                 ((this.state.thickness/total)*15)+
                                 ((this.state.intelligence/total)*10)+
                                 ((this.state.savageness/total)*10)+
                                 ((this.state.ratchetness/total)*5)+
                                 ((this.state.diversity/total)*5)))/100
       
   }
   return Promise
 }

 async onRefresh() {
      await this.setState({ isFetching: true });
      /*var eventquery = await API.graphql(graphqlOperation(queries.listEvents ))
      await this.setState({events:eventquery.data.listEvents.items})
        await Promise.all([this.postername(),
                            this.userlikes(),
                            this.alllikes(),
                            this.eventpics(),
                            this.rating(),
                            this.posterpics()
        ])*/
        this.setState({ isFetching: false })
  
}


  renderSectionZero = () => {
        //console.log('images render: ', this.state.image) 
        if (this.state.isFetching) {
          return <View style={{
            width: '100%',
            height: '100%',
            backgroundColor:'black'
          }}><ActivityIndicator color= '#42a5f5' size='large' style={{marginTop:250,bottom:'0%'}} /></View>;
        }
        return(
          <View style={{ marginBottom: 0, position:'absolute',top:'0%',width:'98%',left:'1%',marginVertical: 0,height:'100%'}}> 
          <View style={{position:'absolute',height:'18%',width:'100%',top:'0%',backgroundColor:'black',zIndex:2}}></View>
          <FlatList 
              style={{top:this.state.flatlisttop,height: this.state.flatlistheight,borderColor:'white'}}
              //data={this.state.orgimage}
              data={this.state.currentUser}
              scrollEnabled={true}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              //numColumns = {this.state.numColumnss}
              //key={this.state.numColumnss}
              renderItem={ ({ item }) => (
                  
              

                  <TouchableOpacity style={[ {borderColor:'white'},{borderWidth:1},{width:'100%'},{height:width/6}  ]}
                   onPress={async() => {
                    await store1.default.dispatch({
                      type: "navigate",
                      payload: { identityid:item.identityid,
                      username:item.username,
                      cusername:item.username.toUpperCase(),
                      ausername:item.ausername,
                      causername:item.ausername.toUpperCase(),
                      firstname:item.firstname,
                      lastname:item.lastname,
                      incollege:item.incollege,
                      collegename:item.collegename,
                      major:item.major,
                      race:item.race,
                      gender:item.gender,
                      birthday:item.birthday,
                      country:item.country,
                      userpic:item.userpic,
                      userbio:item.userbio,
                      utype:item.utype,
                      auserbio:item.auserbio,
                      auserpic:item.auserpic,
                      orgname:item.orgname,
                     id:item.id,
                     anonymous:item.anonymous,
                      }})
                     this.props.navigation.push('UserProfile')}} >
                          <Image style={{ borderRadius: 50/2, height: '80%', width: '30%', position:'absolute',top:'10%',left:'0%', resizeMode: 'contain' }} source = {{uri:item.img }} />
                          <Text style={{color:'white',position:'absolute',top:'60%',left:'60%',right:'0%',fontSize:15,color:'#42a5f5'}}>{item.rating}</Text>
                          <Text style={{color:'white',position:'absolute',top:'10%',left:'25%',fontSize:25,color:'white'}}>{item.fname+" "+item.lname}</Text>
                          <Text style={{color:'white',position:'absolute',bottom:'10%',left:'25%',fontSize:20,color:'#42a5f5'}}>{'@'+item.uname}</Text>
                            
                  </TouchableOpacity>
             
              )
              } 
            keyExtractor={(items, index, numColumns) => index.toString()} />
  
   
          
          </View>
          ) 
   }
   renderSectionOne = () => {
        if (this.state.isFetching) {
          return <View style={{
            width: '100%',
            height: '100%',
            backgroundColor:'black'
          }}><ActivityIndicator color= '#42a5f5' size='large' style={{marginTop:250,bottom:'0%'}} /></View>;
        }
         return(
            <View style={{ marginBottom: 0, position:'absolute',top:'0%',width:'98%',left:'1%',marginVertical: 0,height:'100%'}}> 
            <View style={{position:'absolute',height:'18%',width:'100%',top:'0%',backgroundColor:'black',zIndex:2}}></View>
            <FlatList 
                style={{top:this.state.flatlisttop,height: this.state.flatlistheight,borderColor:'white'}}
                //data={this.state.orgimage}
                data={this.state.currentUser}
                scrollEnabled={true}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                //numColumns = {this.state.numColumnss}
                //key={this.state.numColumnss}
                renderItem={ ({ item }) => (
                    
                

                    <TouchableOpacity style={[ {borderColor:'white'},{borderWidth:1},{width:'100%'},{height:width/6}  ]}
                     onPress={async() => {
                      await store1.default.dispatch({
                        type: "navigate",
                        payload: { identityid:item.identityid,
                        username:item.username,
                        cusername:item.username.toUpperCase(),
                        ausername:item.ausername,
                        causername:item.ausername.toUpperCase(),
                        firstname:item.firstname,
                        lastname:item.lastname,
                        incollege:item.incollege,
                        collegename:item.collegename,
                        major:item.major,
                        race:item.race,
                        gender:item.gender,
                        birthday:item.birthday,
                        country:item.country,
                        userpic:item.userpic,
                        userbio:item.userbio,
                        utype:item.utype,
                        auserbio:item.auserbio,
                        auserpic:item.auserpic,
                        orgname:item.orgname,
                       id:item.id,
                       anonymous:item.anonymous,
                        }})
                       this.props.navigation.push('UserProfile')}} >
                            <Image style={{ borderRadius: 50/2, height: '80%', width: '30%', position:'absolute',top:'10%',left:'0%', resizeMode: 'contain' }} source = {{uri:item.img }} />
                            <Text style={{color:'white',position:'absolute',top:'60%',left:'60%',right:'0%',fontSize:15,color:'#42a5f5'}}>{item.rating}</Text>
                            <Text style={{color:'white',position:'absolute',top:'10%',left:'25%',fontSize:25,color:'white'}}>{item.fname+" "+item.lname}</Text>
                            <Text style={{color:'white',position:'absolute',bottom:'10%',left:'25%',fontSize:20,color:'#42a5f5'}}>{'@'+item.uname}</Text>
                              
                    </TouchableOpacity>
               
                )
                } 
              keyExtractor={(items, index, numColumns) => index.toString()} />
    
     
            
            </View>
            ) 
       }
    renderSectionTwo = () => {
        //console.log('images render: ', this.state.image) 
        return(
        <View style={{flex: 1, marginBottom: 325, marginVertical: 20}}> 
       
        </View>
        ) 
    }
    renderSectionThree = () => {
        //console.log('images render: ', this.state.image) 
        return(
        <View style={{flex: 1, marginBottom: 325, marginVertical: 20}}> 
       
        </View>
        ) 
    }


   renderSection = () => {
        if(this.state.activeIndex == 0) {
            
        return (
        <View style={{ height:'100%',top:'0%',zIndex:1 }}>
        {this.renderSectionZero()}
        </View>
        )
        }
        if(this.state.activeIndex == 1) {
           /*if (this.state.isFetching) {
          return <View style={{
            width: '100%',
            height: '100%'
          }}><ActivityIndicator color= ' '#42a5f5'' size='large' style={{marginTop:250,bottom:'0%'}} /></View>;
        }*/
        return (
            <View style={{ height:'100%',top:'0%',zIndex:1 }}>
        {this.renderSectionOne()}
        </View>
        )
        }
        if(this.state.activeIndex == 2) {
           
        return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {this.renderSectionTwo()}
        </View>
        )
        }
        if(this.state.activeIndex == 3) {
           
            return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.renderSectionThree()}
            </View>
            )
            }
    }

  render() {
    const { search } = this.state;
    const { navigate } = this.props.navigation;
    
        return(  
           
          <View style={{width:'100%',height:'100%'}}>
            <View style = {{width:100 + "%", height: 100 + "%", backgroundColor:'black'}}>
                   

                {this.renderSection()}
              <View style={{width:100 + "%", height: 50 + "%", top:'0%',backgroundColor:'black',zIndex:2}}></View>
                <View style = {styles.searchBar}>
                    <SearchBar 
                        placeholder="Search campus..."
                        round
                        fontColor="white"
                        autoCapitalize="characters"
                        containerStyle={{backgroundColor: 'black', borderWidth: 1, borderRadius: 10}}
                        
                        onChangeText={this.updateSearch}
                        value={search} /> 
                </View>
                <TouchableOpacity style={{backgroundColor:'rgba(0,0,0,0)',borderRadius: 5,borderColor:'white',borderWidth:1,width: '20%',right:'1%',top: '2.25%',height: '4.5%',position:'absolute',justifyContent:'center',alignItems:'center',zIndex:3}}>
                    <Text style={{color:'white',fontSize:16}}>Cancel</Text>
                </TouchableOpacity>

                



                  <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 0, borderWidth: 1, borderColor: "#eae5e5",position:'absolute',top:'9%',width:'98%',right:'1%',zIndex:3 }}> 
                        <Button transparent
                        style={{alignItems:'center'}}
                        onPress={()=> this.segmentClicked(0)}
                        active={this.state.activeIndex == 0}>
                        <Text style={{marginRight:'1%',color:this.state.t0c,fontSize:16}}>Ghost</Text>
                        <Ionicons 
                        size= {25}
                        name="ios-calendar"
                        style={[this.state.activeIndex == 0 ? {color: "#42a5f5"} : {color: 'white'}]} />
                        
                        </Button>

                        <Button transparent
                        style={{alignItems:'center'}}
                        onPress={()=> this.segmentClicked(1)}
                        active={this.state.activeIndex == 1}>
                        <Text style={{marginRight:'1%',color:this.state.t1c,fontSize:16}}>User</Text>
                        <Ionicons 
                        size= {25}
                        name="ios-calendar"
                        style={[this.state.activeIndex == 1 ? {color: "#42a5f5"} : {color: 'white'}]} />
                        
                        </Button>

                        <Button transparent
                        style={{alignItems:'center'}}
                        onPress={()=> this.segmentClicked(2)}
                        active={this.state.activeIndex == 2}>
                        <Text style={{marginRight:'1%',color:this.state.t2c,fontSize:16}}>Event</Text>
                        <Ionicons 
                        size= {25}
                        name="ios-paper"
                        style={[this.state.activeIndex == 2 ? {color: "#42a5f5"} : {color: 'white'}]} />
                        
                        </Button>
                        <Button transparent
                        style={{alignItems:'center'}}
                        onPress={()=> this.segmentClicked(3)}
                        active={this.state.activeIndex == 3}>
                        <Text style={{marginRight:'1%',color:this.state.t3c,fontSize:16}}>Blog</Text>
                        <Ionicons 
                        size= {25}
                        name="ios-star-half"
                        style={[this.state.activeIndex == 3 ? {color: "#42a5f5"} : {color: 'white'}]} />
                        </Button>
                        
                    </View>
                    


                  
            </View>  
            <ActionButton
             buttonColor="rgba(231,76,60,1)" 
             radius = {120}
             style={styles.actionButton}
             bgColor = 'black'
             btnOutRange = 'black'
             >


          <ActionButton.Item buttonColor='dodgerblue' size = {50} 
            onPress={() => {if(this.state.orgoruser=='user'){this.props.navigation.push('UserProfile',{sUser:this.state.cUser})} else{
              //CollegeA:this.state.sUser.CollegeA,OrgSchool:this.state.sUser.OrgSchool,OrgText:this.state.sUser.OrgText,identityId:this.state.sUser.identityId,oratingp:this.state.sUser.oratingp,oratingt:this.state.sUser.oratingt,orgBioatingp:this.state.sUser.oratingp})} else
             this.props.navigation.push('OrgProfile',{sUser:this.state.cUser})}}}>
            <Ionicons name="ios-contact" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>

          <ActionButton.Item buttonColor='orangered' size = {50} onPress={() => this.props.navigation.push('Notifications')}>
            <Ionicons name="md-notifications" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>

          <ActionButton.Item buttonColor='magenta' size = {50} onPress={() => this.props.navigation.push('Search')}>
            <Ionicons name="md-search" style={styles.actionButtonIcon}/>
          </ActionButton.Item>

          

          <ActionButton.Item buttonColor='crimson' size = {50} onPress={() => this.props.navigation.push('Upload')}>
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


    
     




      
 

  



export default SearchPage;
const styles = StyleSheet.create({  
    
    headerText: {
        color: 'white',
        fontSize: 20,
        textAlign: "center",
        marginTop: 10,
    },
    
   
    searchBar: {
      
     borderRadius: 0,
     alignContent: 'center',
     width: '80%',
     left:'-2%',
     top: '1%',
     height: 15,
     position:'absolute',
     zIndex:3
    
        
    },

    tabBar: {
      top: 40,
      height: 100 + '%'  
    },
    
    
    top:
    {
     width: 300,
     height: 30,
     flexDirection: 'row',
     justifyContent: 'center',
     left: 32,
    
    },
    
        actionButtonIcon: {
        fontSize: 30,
        height: 30, 
        position: 'absolute'
        
        
       
        // color: 'white',
        }, 
        actionButton: {
        marginTop:15,
        paddingTop:45,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        position: 'absolute',
        zIndex:999
        },
        
        

     
});