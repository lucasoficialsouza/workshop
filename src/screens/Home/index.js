import React, { useState, useEffect } from "react";
import { Plataform } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { resquest, PERMISSIONS } from 'react-native-permissions';
import Geolocation from "@react-native-community/geolocation";

import Api from "../../Api";

import { 
    Container,
    Scroller,

    HeaderArea,
    HeaderTitle,
    SearchButton,

    LocationArea,
    LocationInput,
    LocationFinder,

    LoadingIcon,
    ListArea
} from "./styles";

import BarberItem from '../../components/BarberItem';

import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';
import { request } from "http";

export default () => {
    const navigation = useNavigation();

    const [locationText, setLocationText] = useState('');
    const [coords, setCoods] = useState(null);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    const handleLocationfinder = async () => {
        setCoods(null);
        let result = await request(
            Plataform.OS === 'ios' ?
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                :
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );

            if(result == 'granted') {

                setLoading(true);
                setLocationText('');
                setList([]);

                Geolocation.getCurrentPosition((info)=>{
                    setCoods(info.coords);
                    getBarbers();
                });

        }
    }

    const getBarbers = async () => {
        setLoading(true);
        setList([]);

        let res = await Api.getBarbers();
        console.log(res);
        if(res.error == '') {
                if(res.loc){
                    setLocationText(res.loc)
                }
            setList(res.data);
        }else {
            alert('Erro:' +res.error);
        }

        setLoading(false)
    }

    useEffect( ()=>{
        getBarbers();
    }, []);
    return (
        <Container>
            <Scroller>

               <HeaderArea>
                    <HeaderTitle numberOfLines={2}>Encontre seu barbeiro favorito</HeaderTitle>
                    <SearchButton onPress={()=>navigation.navigate('Search')}>
                        <SearchIcon width='26' height='26' fill='#FFFFFF'/>
                    </SearchButton>
                </HeaderArea> 

                <LocationArea>
                    <LocationInput  
                        placeholder='Onde você está?'
                        placeholderTextColor='#FFFFFF'
                        value={locationText}
                        onChangeText={t=>setLocationText(t)}
                    />
                        
                    <LocationFinder onPress={handleLocationfinder}>
                        <MyLocationIcon width='24' height='24' fill='#FFFFFF'/>
                    </LocationFinder>
                </LocationArea>
                {loading &&
                <LoadingIcon size='large' color='#FFFFFF'/>
                }

                <ListArea>
                    {list.map((item, k)=>(
                        <BarberItem key={k} data={item} />
                    ))}
                </ListArea>
            </Scroller>
        </Container>
    );
}