import { Text, View, Image, ActivityIndicator, Dimensions, FlatList, TextInput} from 'react-native';
import { Appbar} from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import axios from "axios"
import { ScrollView } from 'react-native-virtualized-view';

import { useEffect, useState,memo } from 'react';

function Genbet({navigation, route}) {
  const fs = Dimensions.get('window').fontScale;
  const { height,width } = Dimensions.get('window');
  let req = route.params.getreq;
  let ttt = route.params.tes;
  let textquote = route.params.texty
  //const prt = "From all the quotes that you know give me four quotes related to the topic of \"" + textquote + "\""
  const [q1, setQ1] = useState("When you have a dream, you've got to grab it and never let go.");
  const [q2, setQ2] = useState("Nothing is impossible. The word itself says 'I'm possible!'");
  const [loading,setLoading] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [userQuote, setUserQuote] = useState('');

  const InputComponent = memo(({ value, onChangeText }) => (
    <TextInput
      style={{ backgroundColor: 'white', flex: 1, marginRight: 10, borderRadius: 5, paddingLeft: 10 }}
      value={value}
      onChangeText={onChangeText}
    />
  ));

  const handlequote = async() => {
    console.log("quote")
    setLoading(true)
    let data = JSON.stringify({
      "model": "command-xlarge-beta",
      "prompt": prt,
      "max_tokens": 150,
      "temperature": 0.4,
      "k": 0,
      "stop_sequences": [],
      "return_likelihoods": "NONE",
      "num_generations": 4
    });
    let configure = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.cohere.ai/v1/generate',
      headers: { 
        'Authorization': 'BEARER M9ebThESCtfKc7fpDg3NI9FmKrqohwicmaziWDE1', 
        'Content-Type': 'application/json'
      },
      data : data
    };  
    console.log(4)
    axios.request(configure)
    .then(response => {
      console.log(response.data);
      const quote1 = response.data.generations[0].text.match(/"([^"]*)"/)[1];
      setQ1(quote1)
      const quote2 = response.data.generations[1].text.match(/"([^"]*)"/)[1];
      setQ2(quote2)
      const quote3 = response.data.generations[2].text.match(/"([^"]*)"/)[1];
      setQ3(quote3)
      const quote4 = response.data.generations[3].text.match(/"([^"]*)"/)[1];
      setQ4(quote4)
      console.log(23)
      console.log(q1)
      console.log(q2) 
      })
    .catch(error => {
      console.log(error);
    }); 
  }
  

  console.log('Start');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [img4, setImg4] = useState('');
  const [responseReceived, setResponseReceived] = useState(false);

  const handlesreq = async () => {
    setLoading(true)
    if (responseReceived) {
      return;
    }
    let configg = {
      method: 'get',
      maxBodyLength: Infinity,
      url: req,
      headers: { 
        'Authorization': 'Token 28fb05402d0a43cf6e42b8b895e988a20ad8179f'
      }
    };

    setTimeout(() => {
      axios.request(configg)
      .then((response) => {
        console.log(response.data.output);
        console.log(2)
        setImg1(response.data.output[0]);
        setImg2(response.data.output[1]);
        setImg3(response.data.output[2]);
        setImg4(response.data.output[3]);
        console.log(34 + " " + response.data.output[1])
        setResponseReceived(true);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)

      });
    }, 6000)
}

useEffect(() => {
  let interval = null;
  if (!responseReceived) {
    interval = setInterval(() => {
      handlesreq();
    }, 6000);
  }
  return () => clearInterval(interval);
}, [responseReceived]);


  useEffect(() => {
  }, [img1, img2, img3, img4]);

  {/*useEffect(() => {
    try {
      handlequote();
    } catch (error) {
      console.error(error);
    }
  }, []);*/}


return (
  (img1 === "" && img2 === "" && img3 === "" && img4 === "") ? 
  <View className="h-full" style={{backgroundColor: '#1D1D1D'}}>  
    <Appbar.Header style={{ backgroundColor: '#1D1D1D', width: '100%'}}>
      <TouchableOpacity onPress={() => {navigation.navigate('Create')}}>
        <Image style={{marginLeft: width*0.01}} source={require("../assets/Frame.png")} alt=""></Image>
      </TouchableOpacity>
      <Appbar.Content className="items-center" title='Prompt Results' color='white' />
    </Appbar.Header>
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="white" style={styles.spinner} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  </View>
  :
  <View className="h-full" style={{backgroundColor: '#1D1D1D'}}>  
    <Appbar.Header style={{ backgroundColor: '#1D1D1D', width: '100%'}}>
      <TouchableOpacity onPress={() => {navigation.navigate('Create')}}>
        <Image style={{marginLeft: width*0.01}} source={require("../assets/Frame.png")} alt=""></Image>
      </TouchableOpacity>
      <Appbar.Content className="items-center" title='Prompt Results' color='white' />
    </Appbar.Header>
    <ScrollView style={{ flex: 1 }}>
      <View className="overflow-hidden bg-stone-900 flex flex-col items-center justify-start" style={{paddingLeft: 21, paddingRight: 27, paddingBottom: 34}}>
        <Text className="text-white-0 text-left " style={{fontSize: 12 / fs, marginTop: 30}}>Showing results for "{ttt}"</Text>
        <View className="flex flex-row items-start justify-center" style={{marginTop: 8}}>
          <FlatList    
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={[
              { key: 'image1', uri: img1},
              { key: 'image2', uri: img2},
              { key: 'image3', uri: img3},
              { key: 'image4', uri: img4},
            ]}
            numColumns = {2}
            renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => navigation.navigate('edit', {image_url: item.uri, quote: selectedQuote})} style={[styles.button]}>
                    <Image style={styles.image} source={{ uri: item.uri }} resizeMode='cover'/>
                  </TouchableOpacity>
                )}/>
        </View> 
      </View>
    </ScrollView>
  </View>
);

}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    marginTop: 10,
  },
  image: {
    height: Dimensions.get("window").width*0.6,
    width: Dimensions.get("window").width*0.4,
    margin: 5
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1D1D'
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  spinner: {
    marginTop: 20
  },
  quote: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 12,
    margin: 5,
    width: "100%",
  },
  selectedQuote: {
    borderColor: 'blue'
  },
  quoteText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default memo(Genbet);
