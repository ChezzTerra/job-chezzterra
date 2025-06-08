import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const employersData = [
    { id: '1', name: 'Алроса', description: 'Ведущая компания по добыче алмазов в Якутии и один из крупнейших работодателей региона.' },
    { id: '2', name: 'Сургутнефтегаз', description: 'Крупная нефтяная компания, предоставляющая рабочие места в республике.' },
    { id: '3', name: 'Якутуголь', description: 'Компания по добыче угля, активно развивающая региональную экономику.' },
    { id: '4', name: 'Сахаэнерго', description: 'Энергетическая компания, обеспечивающая электричеством большинство населенных пунктов республики.' },
    { id: '5', name: 'Научный центр Республики Саха (Якутия)', description: 'Учреждение, занимающееся научными исследованиями и инновациями.' },
];

const TopEmployers = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={28} color="#5D6B8A" />
                </TouchableOpacity>
                <Text style={styles.header}>Лучшие работодатели</Text>
                <View style={{width: 28}} />
            </View>

            <FlatList
                data={employersData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.employerItem}
                        activeOpacity={0.9}
                    >
                        <View style={styles.employerIcon}>
                            <Ionicons name="business" size={24} color="#5D6B8A" />
                        </View>
                        <View style={styles.employerTextContainer}>
                            <Text style={styles.employerName}>{item.name}</Text>
                            <Text style={styles.employerDescription}>{item.description}</Text>
                        </View>
                        <View style={styles.chevronContainer}>
                            <Ionicons name="chevron-forward" size={20} color="#8A96B0" />
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#D1D9E6',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#3A4A6B',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    employerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#D1D9E6',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 12,
    },
    employerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F4F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    employerTextContainer: {
        flex: 1,
        marginRight: 8,
    },
    employerName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#3A4A6B',
        marginBottom: 6,
    },
    employerDescription: {
        fontSize: 14,
        color: '#5D6B8A',
        lineHeight: 20,
        opacity: 0.9,
    },
    chevronContainer: {
        padding: 8,
        borderRadius: 12,
    },
    separator: {
        height: 12,
    },
});

export default TopEmployers;
