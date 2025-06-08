import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Alert, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AllVacanciesScreen = ({ navigation, route }) => {
    const { vacancies } = route.params || { vacancies: [] };
    const [bookmarked, setBookmarked] = useState({});
    const [refreshing] = useState(false);
    const buttonScale = new Animated.Value(1);

    const handleApplyPress = (vacancy) => {
        if (!vacancy) {
            Alert.alert('Ошибка', 'Информация о вакансии недоступна');
            return;
        }

        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 200,
                easing: Easing.elastic(1.5),
                useNativeDriver: true
            })
        ]).start(() => {
            navigation.navigate('Application', { vacancy });
        });
    };

    const toggleBookmark = (id) => {
        setBookmarked(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderVacancyItem = ({ item }) => (
        <View style={styles.vacancyItem}>
            <View style={styles.vacancyContent}>
                <View style={styles.vacancyHeader}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <TouchableOpacity
                        style={styles.bookmarkIcon}
                        onPress={() => toggleBookmark(item.id)}
                    >
                        <Ionicons
                            name={bookmarked[item.id] ? "bookmark" : "bookmark-outline"}
                            size={24}
                            color={bookmarked[item.id] ? "#7C3AED" : "#94A3B8"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.companyContainer}>
                    <Ionicons name="business" size={16} color="#7C3AED" style={styles.icon} />
                    <Text style={styles.company}>{item.employer}</Text>
                </View>

                <View style={styles.salaryContainer}>
                    <Ionicons name="cash-outline" size={16} color="#10B981" style={styles.icon} />
                    <Text style={styles.salary}>{item.salary}</Text>
                </View>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={14} color="#7C3AED" style={styles.icon} />
                        <Text style={styles.metaText}>{item.area}</Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Ionicons name="briefcase-outline" size={14} color="#7C3AED" style={styles.icon} />
                        <Text style={styles.metaText}>{item.experience}</Text>
                    </View>
                </View>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleApplyPress(item)}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonInner}>
                        <Text style={styles.applyButtonText}>Откликнуться</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFF" style={styles.arrowIcon} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Все вакансии</Text>
                    <View style={styles.headerRight} />
                </View>
            </View>

            <FlatList
                data={vacancies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderVacancyItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                ListHeaderComponent={
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsText}>
                            Найдено {vacancies.length} {vacancies.length % 10 === 1 ? 'вакансия' : vacancies.length % 10 < 5 ? 'вакансии' : 'вакансий'}
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIllustration}>
                            <Ionicons name="briefcase-outline" size={48} color="#CBD5E1" />
                        </View>
                        <Text style={styles.emptyTitle}>Вакансий не найдено</Text>
                        <Text style={styles.emptyText}>Попробуйте изменить параметры поиска</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FC',
    },
    header: {
        paddingTop: StatusBar.currentHeight + 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
                shadowColor: '#000',
            },
        }),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    headerRight: {
        width: 40,
    },
    resultsContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    resultsText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    vacancyItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...Platform.select({
            ios: {
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
                shadowColor: '#7C3AED',
            },
        }),
    },
    vacancyContent: {
        padding: 16,
    },
    vacancyHeader: {
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
        lineHeight: 22,
    },
    bookmarkIcon: {
        marginLeft: 8,
    },
    companyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    company: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
        marginLeft: 6,
    },
    salaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    salary: {
        fontSize: 15,
        fontWeight: '600',
        color: '#065F46',
        marginLeft: 6,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    metaText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
        marginLeft: 4,
    },
    icon: {
        marginRight: 4,
    },
    applyButton: {
        backgroundColor: '#7C3AED',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingVertical: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 14,
    },
    arrowIcon: {
        marginLeft: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginTop: 32,
    },
    emptyIllustration: {
        backgroundColor: '#F1F5F9',
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    emptyTitle: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default AllVacanciesScreen;
