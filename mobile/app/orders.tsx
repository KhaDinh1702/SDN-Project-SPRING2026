import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { orderService } from '@/services/orderService';
import { AuthContext } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Added refreshing state
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user?._id) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            if (!refreshing) setLoading(true); // Only show full loading indicator if not refreshing
            const data = await orderService.getByUserId(user?._id || '');
            setOrders(data || []);
        } catch (error) {
            console.error('Load orders failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false); // Reset refreshing state
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return '#ff9800';
            case 'processing': return '#2196f3';
            case 'shipped': return '#9c27b0';
            case 'delivered': return '#4caf50';
            case 'cancelled': return '#f44336';
            default: return '#757575';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderOrderItem = ({ item }: { item: any }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderNumber}>Đơn hàng #{item._id.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.order_status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.order_status) }]}>
                        {item.order_status}
                    </Text>
                </View>
            </View>

            <View style={styles.itemsPreview}>
                {(item.items || []).map((it: any, index: number) => (
                    <Text key={index} style={styles.itemText} numberOfLines={1}>
                        • {it.product_id?.name || 'Sản phẩm'} x{it.quantity}
                    </Text>
                ))}
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Tổng tiền:</Text>
                <Text style={styles.totalValue}>{item.total_amount?.toLocaleString()}đ</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
                <TouchableOpacity onPress={loadOrders} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={22} color="#0a7ea4" />
                </TouchableOpacity>
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
                    <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.replace('/')}>
                        <Text style={styles.shopNowText}>Mua ngay</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    refreshBtn: {
        padding: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 12,
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    orderDate: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    itemsPreview: {
        marginBottom: 12,
    },
    itemText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 14,
        color: '#777',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e53935',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    shopNowBtn: {
        backgroundColor: '#0a7ea4',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shopNowText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
