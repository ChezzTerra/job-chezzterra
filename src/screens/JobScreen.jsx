import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

const JobScreen = () => {
    const navigation = useNavigation(); // Получаем доступ к навигационным функциям

    return (
        <>
            <StatusBar translucent backgroundColor='transparent' />
            <View style={{
                flex: 1,
                backgroundColor: '#FFF'
            }}>
                <HeaderBackButton
                    backLabelVisible={false}
                    onPress={() => navigation.goBack()}
                    tintColor="#000"
                    label=""
                    style={{ marginLeft: 17 }}
                />
                <View>
                    <Image source={require('../../assets/office.png')}
                        style={{
                            width: 420,
                            resizeMode: 'cover'
                        }} />
                    <Image source={require('../../assets/almaze1.png')}
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            bottom: -35,
                            width: 40,
                            height: 40

                        }} />
                </View>

                <View style={{
                    marginTop: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontWeight: '600',
                        fontSize: 24
                    }}>Менеджер по инженерной безопасности</Text>
                    <Text style={{
                        fontWeight: '300',
                        fontSize: 16
                    }}>Якутск</Text>
                </View>

                <View style={{ padding: 16 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '600',
                        marginBottom: 16
                    }}>Требования</Text>
                    <Text>{``}</Text>
                </View>

                <View style={{ padding: 16 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '600',
                        marginBottom: 16
                    }}>Квалификация</Text>
                    <Text>{``}</Text>
                </View>

                <View style={{ padding: 16 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '600',
                        marginBottom: 16
                    }}>Необходимые навыки</Text>
                    <Text>знания русского языка </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    padding: 16,
                    position: 'absolute',
                    bottom: 0
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        marginRight: 16,
                        backgroundColor: '#3F6CDF',
                        padding: 16,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: '#FFF'
                        }}>подать </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        backgroundColor: '#3F6CDF',
                        padding: 10,
                        borderRadius: 10


                    }}>
                        <Ionicons name='chatbox-ellipses-outline' size={24} color='#FFF' />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default JobScreen;
