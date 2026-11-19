import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/styles';
import colors from './styles/colors';
import { useHome } from '../contexts/HomeContext';

const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

const firstValue = (source, keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  }
  return 0;
};

const formatDate = (value) => {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusLabel = (value) => String(value || 'Pending')
  .replace(/[_-]+/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const CodLedgerScreen = () => {
  const navigation = useNavigation();
  const { fetchRiderCodLedger } = useHome();
  const [ledger, setLedger] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadLedger = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');

    try {
      setLedger((await fetchRiderCodLedger()) || {});
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to load COD ledger.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchRiderCodLedger]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  const summary = ledger?.summary || ledger?.totals || ledger;
  const transactions = useMemo(() => {
    const rows = ledger?.ledger || ledger?.transactions || ledger?.records || ledger?.entries || ledger?.items || [];
    return Array.isArray(rows) ? rows : [];
  }, [ledger]);
  const totalCod = firstValue(summary, ['total_cod', 'total_collected', 'total_cod_collected', 'collected_amount', 'sum_collected']);
  const totalCollected = firstValue(summary, ['collected_cod', 'total_collected', 'total_cod_collected', 'collected_amount', 'sum_collected']);
  const pendingAmount = firstValue(summary, ['pending_cod', 'pending_amount', 'total_pending', 'sum_pending']);
  const totalCommission = firstValue(summary, ['total_commission', 'commission']);
  const totalEarnings = firstValue(summary, ['total_earnings', 'earnings']);
  const totalSubmitted = firstValue(summary, ['submitted_cod', 'total_submitted', 'total_cod_submitted', 'submitted_amount', 'sum_submitted']);
  const unsubmittedAmount = firstValue(summary, ['unsubmitted_cod', 'unsubmitted_amount', 'total_unsubmitted']);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {/* <View style={ledgerStyles.titleBar}>
        <Pressable style={ledgerStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={ledgerStyles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={ledgerStyles.title}>COD Ledger</Text>
          <Text style={ledgerStyles.subtitle}>Cash collection overview</Text>
        </View>
        <Pressable style={ledgerStyles.refreshButton} onPress={() => loadLedger(true)} disabled={isRefreshing}>
          <Text style={ledgerStyles.refreshText}>{isRefreshing ? '...' : '↻'}</Text>
        </Pressable>
      </View> */}
  <View style={styles.titleBar}>
        <Pressable style={styles.titleBarBack} onPress={() => navigation.goBack()}>
          <Text style={styles.titleBarBackText}>‹</Text>
        </Pressable>
        <Text style={styles.titleBarText}>COD Ledger</Text>
        <View style={styles.titleBarSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={ledgerStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadLedger(true)} tintColor={colors.gold} />}
      >
        {isLoading ? (
          <View style={ledgerStyles.centerState}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={ledgerStyles.stateText}>Loading COD ledger...</Text>
          </View>
        ) : errorMessage ? (
          <View style={ledgerStyles.stateCard}>
            <Text style={ledgerStyles.errorTitle}>Could not load ledger</Text>
            <Text style={ledgerStyles.stateText}>{errorMessage}</Text>
            <Pressable style={ledgerStyles.retryButton} onPress={() => loadLedger()}>
              <Text style={ledgerStyles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={ledgerStyles.heroCard}>
              <View>
                <Text style={ledgerStyles.heroLabel}>TOTAL COD COLLECTED</Text>
                <Text style={ledgerStyles.heroAmount}>{money(totalCollected)}</Text>
                <Text style={ledgerStyles.heroHint}>All cash collections from your deliveries</Text>
              </View>
              <View style={ledgerStyles.heroIcon}><Text style={ledgerStyles.heroIconText}>₹</Text></View>
            </View>

            <View style={ledgerStyles.statsRow}>
              <View style={[ledgerStyles.statCard, ledgerStyles.greenCard]}>
                <Text style={ledgerStyles.statAmount}>{money(totalSubmitted)}</Text>
                <Text style={ledgerStyles.statLabel}>Submitted</Text>
              </View>
              <View style={[ledgerStyles.statCard, ledgerStyles.orangeCard]}>
                <Text style={ledgerStyles.statAmount}>{money(pendingAmount)}</Text>
                <Text style={ledgerStyles.statLabel}>Pending</Text>
              </View>
            </View>

            <View style={ledgerStyles.statsRow}>
              <View style={[ledgerStyles.statCard, ledgerStyles.goldCard]}>
                <Text style={ledgerStyles.statAmount}>{money(totalCod)}</Text>
                <Text style={ledgerStyles.statLabel}>Total COD</Text>
              </View>
              <View style={[ledgerStyles.statCard, ledgerStyles.greenCard]}>
                <Text style={ledgerStyles.statAmount}>{money(totalCommission)}</Text>
                <Text style={ledgerStyles.statLabel}>Commission</Text>
              </View>
            </View>

            <View style={ledgerStyles.statsRow}>
              <View style={[ledgerStyles.statCard, ledgerStyles.goldCard]}>
                <Text style={ledgerStyles.statAmount}>{money(totalEarnings)}</Text>
                <Text style={ledgerStyles.statLabel}>Total Earnings</Text>
              </View>
              <View style={[ledgerStyles.statCard, ledgerStyles.orangeCard]}>
                <Text style={ledgerStyles.statAmount}>{money(unsubmittedAmount)}</Text>
                <Text style={ledgerStyles.statLabel}>Unsubmitted COD</Text>
              </View>
            </View>

            <View style={ledgerStyles.sectionHeader}>
              <Text style={ledgerStyles.sectionTitle}>Transaction history</Text>
              <Text style={ledgerStyles.countText}>{transactions.length} records</Text>
            </View>

            {transactions.length === 0 ? (
              <View style={ledgerStyles.emptyCard}>
                <Text style={ledgerStyles.emptyIcon}>₹</Text>
                <Text style={ledgerStyles.emptyTitle}>No COD transactions yet</Text>
                <Text style={ledgerStyles.stateText}>Collected COD transactions will appear here.</Text>
              </View>
            ) : transactions.map((transaction, index) => {
              const amount = firstValue(transaction, ['cod_amount', 'amount', 'collected_amount', 'total']);
              const transactionEarnings = firstValue(transaction, ['earnings', 'earning', 'delivery_earning']);
              const orderNumber = transaction.order_number || transaction.order_id || transaction.order_code || transaction.order?.order_id || `Transaction ${index + 1}`;
              const transactionStatus = String(transaction.cod_status || transaction.status || transaction.payment_status || 'pending').toLowerCase();
              const isComplete = ['done', 'completed', 'collected', 'submitted', 'success', 'paid'].includes(transactionStatus);

              return (
                <View key={transaction.id || transaction.order_id || index} style={ledgerStyles.transactionCard}>
                  <View style={ledgerStyles.transactionIcon}><Text style={ledgerStyles.transactionIconText}>₹</Text></View>
                  <View style={ledgerStyles.transactionCopy}>
                    <Text style={ledgerStyles.orderText}>Order #{orderNumber}</Text>
                    <Text style={ledgerStyles.dateText}>{formatDate(transaction.cod_created_at || transaction.created_at || transaction.date || transaction.transaction_date || transaction.collected_at)}</Text>
                  </View>
                  <View style={ledgerStyles.transactionRight}>
                    <Text style={ledgerStyles.transactionAmount}>{money(amount)}</Text>
                    <Text style={ledgerStyles.earningText}>Earned {money(transactionEarnings)}</Text>
                    <Text style={[ledgerStyles.statusText, isComplete ? ledgerStyles.completeText : ledgerStyles.pendingText]}>
                      {statusLabel(transaction.cod_status || transaction.status || transaction.payment_status)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const ledgerStyles = {
  titleBar: { height: 82, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gold },
  backButton: { width: 38, height: 42, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#080808', fontSize: 38, lineHeight: 42 },
  title: { color: '#080808', fontSize: 21, fontWeight: '900' },
  subtitle: { marginTop: 2, color: '#4E4100', fontSize: 12, fontWeight: '700' },
  refreshButton: { marginLeft: 'auto', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#FFF1A8' },
  refreshText: { color: '#080808', fontSize: 25, fontWeight: '900' },
  content: { flexGrow: 1, padding: 12, paddingBottom: 30 },
  heroCard: { minHeight: 148, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 22, backgroundColor: colors.cardDark },
  heroLabel: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  heroAmount: { marginTop: 6, color: colors.white, fontSize: 36, fontWeight: '900' },
  heroHint: { marginTop: 5, color: colors.mutedLight, fontSize: 11 },
  heroIcon: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 29, backgroundColor: colors.gold },
  heroIconText: { color: '#080808', fontSize: 30, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 17, backgroundColor: colors.card },
  greenCard: { borderLeftWidth: 3, borderLeftColor: colors.green },
  orangeCard: { borderLeftWidth: 3, borderLeftColor: colors.gold },
  goldCard: { borderLeftWidth: 3, borderLeftColor: colors.goldDark },
  statAmount: { color: colors.white, fontSize: 20, fontWeight: '900' },
  statLabel: { marginTop: 4, color: colors.muted, fontSize: 11, fontWeight: '700' },
  sectionHeader: { marginTop: 26, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.white, fontSize: 17, fontWeight: '900' },
  countText: { color: colors.muted, fontSize: 11 },
  transactionCard: { minHeight: 76, marginBottom: 9, padding: 13, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: colors.card },
  transactionIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: '#3B3210' },
  transactionIconText: { color: colors.gold, fontSize: 20, fontWeight: '900' },
  transactionCopy: { flex: 1, marginLeft: 11 },
  orderText: { color: colors.white, fontSize: 13, fontWeight: '900' },
  dateText: { marginTop: 4, color: colors.mutedLight, fontSize: 11 },
  transactionRight: { alignItems: 'flex-end', marginLeft: 8 },
  transactionAmount: { color: colors.white, fontSize: 14, fontWeight: '900' },
  earningText: { marginTop: 3, color: colors.gold, fontSize: 10, fontWeight: '800' },
  statusText: { marginTop: 5, fontSize: 10, fontWeight: '900' },
  completeText: { color: colors.green },
  pendingText: { color: colors.gold },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stateCard: { marginTop: 80, padding: 22, alignItems: 'center', borderRadius: 18, backgroundColor: colors.card },
  stateText: { marginTop: 8, color: colors.mutedLight, fontSize: 12, textAlign: 'center' },
  errorTitle: { color: colors.white, fontSize: 17, fontWeight: '900' },
  retryButton: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.gold },
  retryText: { color: '#080808', fontSize: 13, fontWeight: '900' },
  emptyCard: { padding: 28, alignItems: 'center', borderRadius: 18, backgroundColor: colors.card },
  emptyIcon: { color: colors.gold, fontSize: 28, fontWeight: '900' },
  emptyTitle: { marginTop: 10, color: colors.white, fontSize: 15, fontWeight: '900' },
};

export default CodLedgerScreen;
