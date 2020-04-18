import React , { Component } from 'react';
import {KeyboardAvoidingView, TextInput, View, ScrollView, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ImageBackground,FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import ActionButton from 'react-native-circular-action-menu';
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations';
import store from '../redux/store/currentuserstore'
import * as store1 from '../redux/store/navigationstore'
import * as store2 from '../redux/store/followingstore'
import * as store3 from '../redux/store/eventstore'
import { ThemeConsumer } from 'react-native-elements';
//import { FlatList } from 'react-native-gesture-handler';
class EventClickPage extends React.Component{

    static navigationOptions = {
        headerShown: false
        }
    

    constructor(props) {
        super(props);

        
        this.state = {
            switch1:false,
            processing:false,
            liked: false, 
            disliked: false,
            posting:false,
            screenWidth: Dimensions.get("window").width,
            likes:0,
            //licon,
            //dlicon,
            dislikes:0,
            comments: 0,
            IDENTITYID:'',
            currentUser: [],
            orginfo:[],
            isFetching: false,
            following:store2.default.getState().following,
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
            
          eventid:store3.default.getState().id,
          eid:store3.default.getState().eid,
          ename:store3.default.getState().ename,
          cename:store3.default.getState().cename,
          etime:store3.default.getState().etime,
          elocation:store3.default.getState().elocation,
          edetails:store3.default.getState().edetails,
          eventidentityid:store3.default.getState().identityid,
          epicpath:store3.default.getState().epicpath,
          eventanonymous:store3.default.getState().anonymous,
          eida:store3.default.getState().eida,
          eventpostername:store3.default.getState().postername,
          posterpic:store3.default.getState().posterpic,
          pusername:store3.default.getState().pusername,
          cuserliked:store3.default.getState().cuserliked,
          cuserdisliked:store3.default.getState().cuserdisliked,
          alllikes:store3.default.getState().alllikes,
          alldislikes:store3.default.getState().alldislikes,
          eventpic:store3.default.getState().eventpic,
          rating:store3.default.getState().rating,
          likerowid:store3.default.getState().likerowid,

            followings:store2.default.getState().followings,
            eventcomments:[],
            eventcomments0:[],
            eventcomments00:[],
            eventcomment:null,
            
            
            eventComment: null,
            isFetching: true,
            elikes:[]
            
           
         };

         store.subscribe(()=>{this.setState(store.getState())});
         store1.default.subscribe(()=>{this.setState(store1.default.getState())})
         store2.default.subscribe(()=>{this.setState(store2.default.getState())})
         store3.default.subscribe(()=>{this.setState(store3.default.getState())})

       

    }

      

   
    async componentDidMount() {
        console.log("App subscribe this.state:" + JSON.stringify(this.state))
        //this.props.navigation.addListener('willFocus',this.load)
        this.setState({isFetching:true})
        //var eventquery = await API.graphql(graphqlOperation(queries.listEventcomments)) 
        //console.log(eventquery)
        //console.log(this.state.eventid)
        var eventquery = await API.graphql(graphqlOperation(queries.listEventcomments, { filter: { eid:{beginsWith: this.state.eid+'r'}  }})) 
        //console.log(eventquery)

        var eventlikequery = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid:{beginsWith: this.state.eid+'r'},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)}  }})) 
        var alleventlikequery = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid:{beginsWith: this.state.eid+'r'}}})) 
        //var total = alleventlikequery.data.listEventlikes.items.length



        var ctalley=0
        await this.setState({eventcomments0:eventquery.data.listEventcomments.items,
                                elikes:eventlikequery.data.listEventlikes.items,
                                alikes:alleventlikequery.data.listEventlikes.items})
        
        for(let i=0;i<this.state.eventcomments0.length ; i++){
            //console.log(this.state.eventcomments[i].eid.split('r'))
            this.state.eventcomments0[i].alikes=0
            this.state.eventcomments0[i].adlikes=0
            this.state.eventcomments0[i].liked="grey"
            this.state.eventcomments0[i].disliked="grey"
            // Define the color of the like and dislike button based on whether or not this user liked this event comment
            for(let k=0;k<this.state.elikes.length ; k++){
                if(this.state.elikes[k].eid==this.state.eventcomments0[i].eid){
                    if(this.state.elikes[k].likes=="-1"){
                        this.state.eventcomments0[i].liked="grey"
                        this.state.eventcomments0[i].disliked="cyan"
                    } else {
                        this.state.eventcomments0[i].liked="cyan"
                        this.state.eventcomments0[i].disliked="grey"
                    }
                    break
                    //this.state.eventcomments0[i].tlikes=this.state.elikes[k].likes
                }
            }   

            // Calculate the total number of dislikes and likes for each event comment
            for(let k=0;k<this.state.alikes.length ; k++){   
                if(this.state.alikes[k].eid==this.state.eventcomments0[i].eid){
                    if(this.state.elikes[k].likes=="-1"){
                        this.state.eventcomments0[i].adlikes=this.state.eventcomments0[i].adlikes+1
                    } else {
                        this.state.eventcomments0[i].alikes=this.state.eventcomments0[i].alikes+1
                    }
                    //this.state.eventcomments0[i].tlikes=this.state.elikes[k].likes
                }
            }
            if(this.state.eventcomments0[i].eid.split('r').length>2){
                //console.log(this.state.eventcomments0[i].eid.split('r'))
                //this.state.eventcomments.concat(this.state.eventcomments0[i])
                this.state.eventcomments00=this.state.eventcomments00.concat(this.state.eventcomments0[i])
            } else {
                this.state.eventcomments=this.state.eventcomments.concat(this.state.eventcomments0[i])
            }
            
            /*if(Number(this.state.eventcomments.split('r')[0])>ctalley){
                var ctalley = Number(this.state.eventcomments.split('r')[0])
            }*/
        }
        
        for(let i=0;i<this.state.eventcomments.length ; i++){
            this.state.eventcomments[i].replies=[]
            for(let k=0;k<this.state.eventcomments00.length ; k++){
                if(this.state.eventcomments[i].eid.split('r')[1]==this.state.eventcomments00[k].eid.split('r')[1]){
                    this.state.eventcomments[i].replies=this.state.eventcomments[i].replies.concat(this.state.eventcomments00[k])
                }
            }
            this.state.eventcomments[i].height=undefined //(this.state.eventcomments[i].replies.length*30)
            this.state.eventcomments[i].s=true
            this.state.eventcomments[i].sheight=0
            this.state.eventcomments[i].rplyheight=25
            this.state.eventcomments[i].rplymrgn=8
            this.state.eventcomments[i].color='white'
            this.state.eventcomments[i].msg=(this.state.eventcomments[i].replies.length+" Replies")
            this.state.eventcomments[i].msgs=(this.state.eventcomments[i].replies.length+" Replies")
            this.state.eventcomments[i].sh='10%'
        }
        

        console.log('this.state.eventcomments: ', this.state.eventcomments)
        this.setState({ isFetching: false })

    }
  


    updateLikes = () => {

        if(!this.state.liked) { 
        this.setState((prevState, props) => {
            return {
                likes: prevState.likes + 1,
                liked: true,             
            };
        });
    
    } else {
  
        this.setState((prevState,props) => {
            return { 
                likes: prevState.likes - 1,
                liked: false,
                iconColour: "white"
                
        };
    });
  
    } 
  }
  
  
    updateDislikes = () => {
  
        if(!this.state.disliked) { 
        this.setState((prevState, props) => {
            return {
                dislikes: prevState.likes + 1,
                disliked: true,
                iconColour:"red"
            };
        });
    
    } else {
  
        this.setState((prevState,props) => {
            return { 
                dislikes: prevState.dislikes - 1,
                disliked: false,
                iconColour:"white"
        };
    });
  
    } 
  }




    render(){
        var  {navigation}  = this.props;
        var pic_name = navigation.getParam('picpath', 'NO-path');  
        console.log(this.state.currentUser)
        return(
                
                  <KeyboardAvoidingView style = {{flex:1, width: 100 + "%", backgroundColor:'black'}}> 
                  
                      <View style={{height:'100%',width:'100%'}}>
                          
                      <ScrollView style={{top:'5%', height:'150%',width:'100%'}}>
        {/*<Text style={{color:'white',position:'absolute',top:'20%',right:'50%'}}>{this.state.currentUser.EventLocation}</Text>*/}
            <View style = {styles.userBar}> 
            {/*<Text style={{  fontSize: 23,  
        textAlign: 'center',  
        color: 'white',  }}>User Name: {JSON.stringify(pic_name)}</Text>
            {console.log('picname:', JSON.stringify(pic_name))}*/}
            <Image style = {{alignItems: 'center', top: 5,  height: 60, width: 60, left: -5, borderColor: 'white', borderWidth: 1, borderRadius: 30}} source =  {{uri: this.state.posterpic}}>
            </Image>

             <View style = {styles.organizationBar}> 

                        <TouchableOpacity>
                        <Text style = {styles.organizationHandle}>{this.state.pusername}</Text>
                        </TouchableOpacity>

                        {/*<TouchableOpacity>
                        <Text style = {styles.organizationHandle}>@nsbe  </Text>
                        </TouchableOpacity>*/}

                        {/*<Text style = {styles.activity}> · 45 minutes ago </Text>*/}
                        </View>
                   
                <View style = {styles.eventDescription}>
                        <TouchableOpacity   onPress={() => this.props.navigation.navigate('EventClick')} >
                        <Text 

                        style = {{marginLeft: 10, fontWeight: '200', color: "white", fontSize: 15,  position: "absolute", top: 0}}>
                        {'Event: '+this.state.ename+", Location: "+this.state.elocation+", Time: "+this.state.etime}
                        </Text>
                        </TouchableOpacity>
                        </View>
                        
                  
                                           
                </View>

                

               
               
               <View style = {{ height: 250, width: 100+'%',  marginBottom: 10}}> 
                <TouchableOpacity> 
           
              <Image
              style = {{width: 100 + '%', height: 100 + '%', top: 15}}
              source = {{uri: this.state.eventpic}}> 
             
              
              </Image> 
                </TouchableOpacity>

                </View>

                <View style = {styles.iconBar}>
                  

                    


                   <TouchableOpacity onPress = { async() => { 
                        if(this.state.cuserliked=='cyan'){

                        } else {
                        await this.setState({processing:true})
                            if(this.state.cuserdisliked=='cyan'){
                            //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: this.state.eventid},identityId:{eq:this.state.identityid} } } ))
                            //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
                            await this.setState({
                                alllikes:this.state.alllikes+1,
                                alldislikes:this.state.alldislikes-1,
                                cuserdisliked:'grey',
                                cuserliked:'cyan'})
                            //var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: this.state.eid},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))
                            await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:this.state.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous),likes: "1"} }))
                            await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:this.state.likerowid} }))
                        } else {
                            await this.setState({
                                alllikes:this.state.alllikes+1,
                                cuserdisliked:'grey',
                                cuserliked:'cyan'})
                            //this.setState({switch1:!this.state.switch1})
                            await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:this.state.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous), likes: "1"} }))
                            }
                        var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: this.state.eid},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))
                        await this.setState({likerowid:cevent.data.listEventlikes.items[0].id})
                        await this.setState({processing:false})
                        }
                        
                        }}>
                        
                    <FontAwesome style = {{marginLeft: 20,color: this.state.cuserliked,top: 10}} 
                    name = "thumbs-o-up" size={20} />

                    </TouchableOpacity>

                   
                    <Text style = {{color: 'gray', top: 12}}> {this.state.alllikes}  </Text>
                  

                    

                    <TouchableOpacity onPress = { async() => { 
                        
                        if((this.state.cuserdisliked=='cyan')||(this.state.processing)){

                        } else {
                        await this.setState({processing:true})
                            if(this.state.cuserliked=='cyan'){
                            //var cUserfollowing = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eventid: { eq: this.state.eventid},identityId:{eq:this.state.identityid} } } ))
                            //this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
                            await this.setState({
                                alldislikes:this.state.alldislikes+1,
                                alllikes:this.state.alllikes-1,
                                cuserliked:'grey',
                                cuserdisliked:'cyan'})
                            //this.setState({switch1:!this.state.switch1})
                            //var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: this.state.eid},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))
                            await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:this.state.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous),likes: "-1"} }))
                            await API.graphql(graphqlOperation(mutations.deleteEventlike, {input: {id:this.state.likerowid} }))
                         } else {
                            await this.setState({
                                alldislikes:this.state.alldislikes+1,
                                cuserliked:'grey',
                                cuserdisliked:'cyan'})
                            //this.setState({switch1:!this.state.switch1})
                            await API.graphql(graphqlOperation(mutations.createEventlike, {input: {eid:this.state.eid, identityid:this.state.identityid, anonymous:String(this.state.anonymous), likes: "-1"} }))
                            }
                        var cevent = await API.graphql(graphqlOperation(queries.listEventlikes, { filter: { eid: { eq: this.state.eid},identityid:{eq:this.state.identityid},anonymous:{eq:String(this.state.anonymous)} } } ))
                        await this.setState({likerowid:cevent.data.listEventlikes.items[0].id})
                        await this.setState({processing:false})
                        }
                        
                        }}>

                    <FontAwesome style = {{marginLeft: 100,color:this.state.cuserdisliked,top: 10}} name = "thumbs-o-down" size={20} />

                    </TouchableOpacity>

                    

                    <Text style = {{color: 'gray', top: 12}}> {this.state.alldislikes}  </Text>

                 


                    
                    
                    <TouchableOpacity>
                   
                    <FontAwesome style = {styles.commentIcon} name = "comment-o" size={20} />

                    </TouchableOpacity>

                    <TouchableOpacity>

                    <Text style = {{color: 'gray', top:12}}> {this.state.comments}  </Text>

                    </TouchableOpacity>

            </View>

              <View style = {{textAlign: 'center',top: 20,height: 100,width: 90 + '%',left: 10,marginRight: 10,
                                    borderBottomWidth: 0.5,
                                    borderColor: 'dimgray'}}>
        <Text style = {{color: 'white', top: 5, left: 5, right: 5, fontWeight: '200', fontSize: 18, }}>{this.state.edetails}</Text>
              </View>

            <View style = {{flexDirection: 'row', height: 60, top: 30, borderColor: 'white'}}> 
            <TouchableOpacity>
            <Image style = {{left: 10, height: 40, width: 40, borderRadius: 20}} source = {{uri: 'https://live.staticflickr.com/1279/4703365225_8c898c7530_b.jpg'}}/>
            </TouchableOpacity>
            
           <TextInput 
           placeholder = 'Add a comment...'
           placeholderTextColor= "white" 
           value = {this.state.eventComment}
           style = {{ paddingLeft: 15, color: 'white', width: 280, height: 40, left: 25, borderRadius: 20, borderColor: 'dimgray', backgroundColor: 'transparent', borderWidth: 1}}
           onChangeText={async(eventComment) => {
                this.setState({eventcomment:eventComment})
               /*if(this.state.eventcomment=='Add a comment...'){
                    await this.setState({eventcomment:eventComment})
               }*/
               //this.setState({ eventComment1:eventComment })

           


           }}> </TextInput>

           <TouchableOpacity onPress={async()=>{
               //var eventquery = await API.graphql(graphqlOperation(queries.listEventcomments, { filter: { eid:{beginsWith: this.state.eventid+'r'}  }})) 
                if(this.state.posting){

                }else {
                    console.log(this.state.eventcomment)
                    await this.setState({posting:true})
                    await API.graphql(graphqlOperation(mutations.createEventcomment, {input: 
                        {eid:this.state.eid+'r1r1',
                          identityid:this.state.identityid,
                          anonymous:this.state.anonymous,
                          ecomment:this.state.eventcomment
                        }}))
                        this.setState({posting:false,eventComment:''})
                }
               

              //var eventquery = await API.graphql(graphqlOperation(queries.listEventcomments, { filter: { eid:{eq: this.state.eid}  }})) 
              
           }}> 
           <Text style = {{left: -28, top: 10, color: 'dodgerblue'}}> Post </Text>
           </TouchableOpacity>

            </View>
            <View style={{height:600}}>
                <FlatList
                extraData={this.state.switch1}
                style={{top:30}}
                data={this.state.eventcomments}
                renderItem={ ({ item }) => (
                    
                    <TouchableOpacity style={{borderWidth:0,borderColor:'grey'}} 
                    onPress={async()=>{
                        if(item.s){
                            
                            for(let i=0;i<this.state.eventcomments.length ; i++){
                                if(item.eid==this.state.eventcomments[i].eid){
                                    this.state.eventcomments[i].sheight=undefined
                                    this.state.eventcomments[i].s=false
                                    this.state.eventcomments[i].msgs=''
                                    this.state.eventcomments[i].rplyheight=0
                                    this.state.eventcomments[i].rplymrgn=0
                                    this.state.eventcomments[i].sh='35%'
                                    
                                    this.state.eventcomments[i].color='cyan'
                                    
                                    this.setState({switch1:!this.state.switch1})
                                    break
                                }
                            }
                        } else {
                            
                            for(let i=0;i<this.state.eventcomments.length ; i++){
                                if(item.eid==this.state.eventcomments[i].eid){
                                    this.state.eventcomments[i].sheight=0
                                    this.state.eventcomments[i].s=true
                                    this.state.eventcomments[i].msgs=this.state.eventcomments[i].msg
                                    this.state.eventcomments[i].rplyheight=undefined
                                    this.state.eventcomments[i].color='white'
                                    this.state.eventcomments[i].rplymrgn=0
                                    this.state.eventcomments[i].sh='10%'
                                    this.setState({switch1:!this.state.switch1})
                                    break
                                }
                            }
                        }
                        //item.sheight=
                    }} >
                        <View style={{left:'0%',width:'100%'}}>
                            <View style={{borderColor:'grey',borderWidth:0,left:'0%',width:'100%',marginRight:'0%',paddingTop:'0%'}}>
                                <View style={{flexDirection:'row',width:'100%',borderWidth:1,borderColor:'grey'}}>
                                    <Text style={{marginBottom:10,marginTop:10, color:item.color,fontSize:20,width:'70%',left:'2%',top:'0%',borderWidth:0,borderColor:'grey'}}>
                                                {item.ecomment}
                                    </Text>
                                    <View style={{height:undefined,top:'0%', right:'0%',width:'30%',borderWidth:0,borderColor:'grey',justifyContent:'center',alignContent:'center',paddingbottom:'0%',flexDirection:'row'}}>
                                                    <TouchableOpacity style={{justifyContent:'center',borderWidth:0.5,borderColor:'grey',height:undefined,width:'50%',left:'0%'}}
                                                            onPress={async()=>{
                                                                if(item.liked=='cyan'){
                                                                    
                                                                } else if(item.disliked=='cyan'){
                                                                    for(let i=0;i<this.state.eventcomments.length ; i++){
                                                                        if(item.eid==this.state.eventcomments[i].eid){
                                                                            this.state.eventcomments[i].liked='cyan'
                                                                            this.state.eventcomments[i].disliked='grey'
                                                                            // add in query and write to the like table, 
                                                                            this.setState({switch1:!this.state.switch1})
                                                                            break
                                                                        }
                                                                    }
                                                                } else {
                                                                    for(let i=0;i<this.state.eventcomments.length ; i++){
                                                                        if(item.eid==this.state.eventcomments[i].eid){
                                                                            this.state.eventcomments[i].liked='cyan'
                                                                            this.state.eventcomments[i].disliked='grey'
                                                                            this.state.eventcomments[i].s=true
                                                                            this.state.eventcomments[i].msgs=this.state.eventcomments[i].msg
                                                                            this.state.eventcomments[i].rplyheight=undefined
                                                                            this.state.eventcomments[i].color='white'
                                                                            this.state.eventcomments[i].rplymrgn=0
                                                                            this.state.eventcomments[i].sh='10%'
                                                                            this.setState({switch1:!this.state.switch1})
                                                                            break
                                                                        }
                                                                    }

                                                                }
                                                                //item.sheight=
                                                            }}>
                                                    <FontAwesome style = {{color: item.liked,height:undefined,left:'30%',top:'0%'}} 
                                                name = "thumbs-o-up" size={25} />
                                                <Text style={{color:'white'}}>{item.alikes}</Text>
                                                    </TouchableOpacity>
                                                    {/*<View style={{width:0.001,borderColor:'grey',borderWidth:0.5}}>
                    
                                                        </View>*/}
                                                    <TouchableOpacity  style={{justifyContent:'center',borderWidth:0.5,borderColor:'grey',height:undefined,width:'50%',right:'0%'}}>
                                                    <FontAwesome style = {{color: item.disliked,height:undefined,left:'30%',bottom:'0%'}} 
                                                name = "thumbs-o-down" size={25} />
                                                <Text style={{color:'white'}}>{item.adlikes}</Text>
                                                    </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{height:'0%'}}></View>

                                <FlatList style={{height:item.sheight,width:'100%',borderColor:'grey',borderWidth:0.5,flexDirection:'row'}} 
                                    data={item.replies}
                                    
                                    renderItem={ ({ item }) => (
                                        /*<TouchableOpacity style={{width:'100%'}}>*/
                                        <View style={{width:'100%',flexDirection:'row'}}>
                                            <Text style={{ left:'2%',marginBottom:10,marginTop:10,color:'white',fontSize:20,borderColor:'grey',borderWidth:0,width:'70%'}}>
                                                {item.ecomment}
                                            </Text>
                                            <View style={{height:undefined,top:'0%', right:'0%',width:'30%',borderWidth:0,borderColor:'grey',justifyContent:'center',alignContent:'center',paddingbottom:'0%',flexDirection:'row'}}>
                                                    <TouchableOpacity style={{justifyContent:'center',borderWidth:0.5,borderColor:'grey',height:undefined,width:'50%',left:'0%'}}>
                                                    <FontAwesome style = {{color: item.liked,height:undefined,left:'30%',top:'0%'}} 
                                                name = "thumbs-o-up" size={25} />
                                                    <Text style={{color:'white'}}>{item.alikes}</Text>
                                                    </TouchableOpacity>
                                                    {/*<View style={{width:0.001,borderColor:'grey',borderWidth:0.5}}>
                    
                                                        </View>*/}
                                                    <TouchableOpacity  style={{justifyContent:'center',borderWidth:0.5,borderColor:'grey',height:undefined,width:'50%',right:'0%'}}>
                                                    <FontAwesome style = {{color: item.disliked,height:undefined,left:'30%',bottom:'0%'}} 
                                                name = "thumbs-o-down" size={25} />
                                                    <Text style={{color:'white'}}>{item.adlikes}</Text>
                                                    </TouchableOpacity>
                                            </View>
                                        </View>

                                    )}>
                                    
                                </FlatList>
                                
                                {/*<View style={{height:item.rplymrgn}}></View>*/}
                                <View style={{height:item.rplyheight,width:'100%',textAlign:'right',borderWidth:1,borderColor:'grey'}}>
                                    <Text style={{paddingBottom:0,paddingTop:0,color:'grey',textAlign:'right',right:'2%',bottom:0,fontSize:20}}>
                                                {item.msgs}
                                            
                                    </Text>
                                </View>
                            </View>
                            
                         </View>

                         <View style={{height:item.sh,marginTop:0,borderTopWidth:0,borderColor:'cyan'}}>

                         </View>
                         
                    </TouchableOpacity>
                    
                   

                )}>
                    
                </FlatList>
            </View>
            </ScrollView>
            <ActionButton

 buttonColor="rgba(231,76,60,1)" 
 radius = {120}
 style={{position:'absolute',bottom:'3%',zIndex:5}}
 bgColor = 'black'
 btnOutRange = 'black'
 >


 <ActionButton.Item buttonColor='dodgerblue' size = {50} 
 onPress={async() => {
   //console.log(store1)
  await store1.default.dispatch({
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
   anonymous:this.state.anonymous,
    }});
   this.props.navigation.push('UserProfile')} }>
 <Ionicons name="ios-contact" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 <ActionButton.Item buttonColor='orangered' size = {50} onPress={() => this.props.navigation.push('MainFeedPage')}>
 <Ionicons name="ios-home" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 <ActionButton.Item buttonColor='magenta' size = {50} onPress={() => this.props.navigation.push('Search')}>
 <Ionicons name="md-search" style={styles.actionButtonIcon}/>
 </ActionButton.Item>

 

 <ActionButton.Item buttonColor='crimson' size = {50} onPress={() => this.props.navigation.push('SelectUpload')}>
 <Ionicons name="md-cloud-upload" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>
 
 <ActionButton.Item buttonColor='lime' size = {60} onPress={() => this.props.navigation.push('Message')}>
 <Ionicons name="ios-chatbubbles" style={styles.actionButtonIcon} size = {50} />
 </ActionButton.Item>

 </ActionButton>
           
           


            </View>
              
        
        </KeyboardAvoidingView>
    )
}

}
export default EventClickPage; 

const styles = StyleSheet.create({

    actionButtonIcon: {
        fontSize: 30,
        height: 30, 
        
        
        
        // color: 'white',
        }, 
        actionButton: {
        marginTop:15,
        paddingTop:45,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        },
    activity:
    {   
        color: 'white',
        fontSize: 14,
        fontWeight:'300'
    },

 
     blogContainer: {
        width: 100 + "%",
        height: 300,
        backgroundColor: 'black',
        flexDirection: "row",
        borderBottomWidth: 0.4,
        borderColor: 'gray'
        
        },

        blogTitle:
    {
        color: 'white',
        fontSize: 16,
        fontWeight:'bold',
        left: 10
        
    },



    commentIcon: {
       marginLeft: 100,
       color: "gray",
       top: 10
    },

    userBar: 
    {
        height: 50,
        //borderColor: 'white',
        borderWidth: 1,
        width: 100 + '%',
        flexDirection: 'row'
    },

     date:{
      position: 'absolute',
        left: 75,
        top: 70,
        color: 'white',
        fontSize: 14,
        fontWeight:'200'  
    },
     

    dislikeIcon:{
        marginLeft: 100,
        color:"gray",
        top: 10
    },

    details: { 
        textAlign: 'center',
        top: 20,
        height: 120,
          //borderColor: 'white',
        width: 90 + '%',
        left: 10,
        marginRight: 10,
        borderBottomWidth: 0.5,
        borderColor: 'dimgray'
    },

    eventDescription: {
        height: 40,
        width: 280,
        position: "absolute",
        bottom: 15,
        right: 12,
        
    },

     iconBar: {
        height: 35,
        width: 100 + "%",
        flexDirection: 'row',
        alignItems: 'flex-start',
        
        top: 10
        
    },

    organizationHandle: {
       
        color: 'cyan',
        fontSize: 22,
        
               
    },

    
    organizationName: {
        marginLeft: 10,
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        
    },


    
    interactionContainer: {
        position: 'absolute',
        top: 75,
        height: 40,
        width: 350,
        left: 10,
        flexDirection:'row',
        
        },

        interactions: {
            fontSize: 16,
            color: 'cyan',
            fontWeight: 'bold',
            
        },

        
    likeIcon:{
        marginLeft: 20,
        color: "gray",
        top: 10
    },

    organizationBar: {
        height: 30,
        width: 280,
        flexDirection: 'row',
        alignItems: 'flex-start',
        top:10
        
    },


    nameContainer: {
        position: 'absolute',
        top: 40,
        height: 100,
        width: 300,
        flexDirection:'row'
    },


   
    textContainer:{
      
        position: 'absolute',
        height: 95 + '%',
        width: 100 + '%',
        marginTop: 5,
              
    },
     
    trending: {
        
        color: 'white',
        fontSize: 14,
        fontWeight:'300'
    },

     trendingContainer: {
        position: 'absolute',
        top: 20,
        height: 30,
        width: 250,
        flexDirection:'row',
        left: 10
        
        },

     userBar: {
        width: 100 + "%",
        height: 90,
        backgroundColor: 'black',
        flexDirection: "row",
        justifyContent: "center",
        borderColor: "gray",
        top: 20
       
        
    },
     
       

});