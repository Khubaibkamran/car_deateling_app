import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_400Regular_Italic } from '@expo-google-fonts/poppins/400Regular_Italic';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_500Medium_Italic } from '@expo-google-fonts/poppins/500Medium_Italic';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { RedHatDisplay_700Bold } from '@expo-google-fonts/red-hat-display/700Bold';
import { RedHatDisplay_500Medium } from '@expo-google-fonts/red-hat-display/500Medium';
import { RedHatDisplay_600SemiBold } from '@expo-google-fonts/red-hat-display/600SemiBold';
import { RedHatDisplay_800ExtraBold } from '@expo-google-fonts/red-hat-display/800ExtraBold';
import { Syne_700Bold } from '@expo-google-fonts/syne/700Bold';
import { isAxiosError } from 'axios';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Alert, AlertHost } from './src/components/AppAlert';
import { logout as logoutRequest } from './src/api/auth';
import {
  deleteVehicle,
  getBooking,
  getBookings,
  getCards,
  getVehicles,
  makeDefaultVehicle,
  createVehicle,
  rescheduleBooking,
} from './src/api/customer';
import { apiMessage } from './src/api/errors';
import {
  ACTIVE_BOOKING,
  conversationFromApi,
  jobDetailFromApi,
  messageFromApi,
  notificationFromApi,
  profileFromUser,
  scheduleToIso,
  stampLabel,
  summaryFromBooking,
  vehicleFromApi,
} from './src/api/mappers';
import { clearSession, refreshToken, restoreSession, setSessionExpiredHandler } from './src/api/session';
import { openChatSocket, SocketMessage } from './src/api/chatSocket';
import { getJob } from './src/api/technician';
import {
  getConversations,
  getMe,
  getMessages,
  getNotifications,
  getUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  openSupportConversation,
  sendMessage as sendMessageRequest,
} from './src/api/shared';
import { ApiBooking, ApiCard, ApiConversation, ApiTechnicianCard, ApiUser, AuthResponse, Role } from './src/api/types';
import { TabKey, TECHNICIAN_TABS } from './src/components/BottomNavBar';
import {
  BellRingIcon,
  BookingsIcon,
  BriefcaseIcon,
  CardIcon,
  DocumentIcon,
  HelpIcon,
  SettingsIcon,
} from './src/components/drawerIcons';
import { WalletTabIcon } from './src/components/extraIcons';
import { BoxTabIcon, CarTabIcon, HomeTabIcon, MessageTabIcon } from './src/components/homeIcons';
import SideDrawer, { DrawerItem } from './src/components/SideDrawer';
import { colors } from './src/constants/theme';
import { JobDetail } from './src/data/jobDetails';
import { Job } from './src/data/jobs';
import { ChatMessage, Conversation } from './src/data/messages';
import { AppNotification } from './src/data/notifications';
import { Plan } from './src/data/packages';
import { usePolling } from './src/hooks/useApi';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignupCustomerScreen from './src/screens/auth/SignupCustomerScreen';
import BookingLocationScreen, { BookingLocation } from './src/screens/booking/BookingLocationScreen';
import BookingPaymentScreen from './src/screens/booking/BookingPaymentScreen';
import BookingScheduleScreen, { Schedule } from './src/screens/booking/BookingScheduleScreen';
import BookingServiceScreen from './src/screens/booking/BookingServiceScreen';
import BookingVehicleScreen from './src/screens/booking/BookingVehicleScreen';
import ServiceCompletedScreen from './src/screens/booking/ServiceCompletedScreen';
import TrackTechnicianScreen from './src/screens/booking/TrackTechnicianScreen';
import MyBookingsScreen from './src/screens/bookings/MyBookingsScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import MainShell from './src/screens/main/MainShell';
import PlaceholderScreen from './src/screens/main/PlaceholderScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import OnboardingScreen1 from './src/screens/onboarding/OnboardingScreen1';
import OnboardingScreen2 from './src/screens/onboarding/OnboardingScreen2';
import PaymentMethodsScreen from './src/screens/payments/PaymentMethodsScreen';
import CustomerProfileScreen from './src/screens/profile/CustomerProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import SelectRoleScreen from './src/screens/role/SelectRoleScreen';
import ServicesScreen from './src/screens/services/ServicesScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import TechniciansScreen from './src/screens/technicians/TechniciansScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import ChatScreen from './src/screens/technician/ChatScreen';
import EarningsScreen from './src/screens/technician/EarningsScreen';
import InRouteScreen from './src/screens/technician/InRouteScreen';
import JobDetailsScreen from './src/screens/technician/JobDetailsScreen';
import MessagesScreen from './src/screens/technician/MessagesScreen';
import MyJobsScreen from './src/screens/technician/MyJobsScreen';
import ServiceProgressScreen from './src/screens/technician/ServiceProgressScreen';
import TechnicianHomeScreen from './src/screens/technician/TechnicianHomeScreen';
import TechnicianProfileScreen from './src/screens/technician/TechnicianProfileScreen';
import AddVehicleScreen, { NewVehicle } from './src/screens/vehicles/AddVehicleScreen';
import MyVehiclesScreen from './src/screens/vehicles/MyVehiclesScreen';
import { BookingSummary } from './src/types/booking';
import { EMPTY_PROFILE, UserProfile } from './src/types/profile';
import { Vehicle } from './src/types/vehicle';

type Screen =
  | 'splash'
  | 'onboarding1'
  | 'onboarding2'
  | 'selectRole'
  | 'signupCustomer'
  | 'signIn'
  | 'forgotPassword'
  | 'home'
  | 'addVehicle'
  | 'bookingVehicle'
  | 'bookingService'
  | 'bookingSchedule'
  | 'bookingLocation'
  | 'bookingPayment'
  | 'trackTechnician'
  | 'serviceCompleted'
  | 'myBookings'
  | 'reschedule'
  | 'paymentMethods'
  | 'technicians'
  | 'settings'
  | 'technicianHome'
  | 'jobDetails'
  | 'inRoute'
  | 'serviceProgress'
  | 'notifications'
  | 'chat'
  | 'editProfile'
  | 'placeholder';

/** What the customer has chosen so far in the booking flow. */
type BookingDraft = {
  vehicleId?: string;
  serviceId?: string;
  serviceName?: string;
  plan?: Plan;
  schedule?: Schedule;
  location?: BookingLocation;
  /** The technician the customer picked; none means "assign one for me". */
  technician?: ApiTechnicianCard | null;
};

const UNREAD_POLL_MS = 30000;
const CHATS_POLL_MS = 15000;
const CHAT_POLL_MS = 4000;
const NOTES_POLL_MS = 10000;
const BOOKINGS_POLL_MS = 10000;

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    RedHatDisplay_500Medium,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_800ExtraBold,
    Syne_700Bold,
  });
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState<Screen>('splash');
  // Which bottom-nav tab is showing while `screen` is 'home' (the main tab area).
  const [tab, setTab] = useState<TabKey>('home');
  // The technician app has its own set of tabs.
  const [techTab, setTechTab] = useState<TabKey>('home');
  // Shows a spinner over the screen while something is being fetched before navigating.
  const [busy, setBusy] = useState(false);

  // Who is using the app: decides which menu, notifications and profile to show.
  const [role, setRole] = useState<Role>('customer');
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Where the notifications / placeholder / settings pages should return to.
  const [returnTo, setReturnTo] = useState<Screen>('home');
  const [placeholderTitle, setPlaceholderTitle] = useState('');

  // ------------------------------------------------------------------ session

  /** Forgets everything about the signed-in person. */
  const resetState = useCallback(() => {
    setSignedIn(false);
    setProfile(EMPTY_PROFILE);
    setDrawerOpen(false);
    setTab('home');
    setTechTab('home');
    setVehicles([]);
    setDefaultVehicleId(undefined);
    setBookings([]);
    setCards([]);
    setSelectedCardId(undefined);
    setNotes([]);
    setUnread(0);
    setRawChats([]);
    setChatConv(undefined);
    setChatMessages([]);
    setDraft({});
    setPendingBooking(null);
    setTrackBooking(null);
    setJob(null);
  }, []);

  const enter = useCallback((user: ApiUser) => {
    setRole(user.role);
    setProfile(profileFromUser(user));
    setSignedIn(true);
    setTab('home');
    setTechTab('home');
    setScreen(user.role === 'technician' ? 'technicianHome' : 'home');
  }, []);

  // A saved session skips the sign-in screens; one that no longer works sends the person back to them.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      resetState();
      setScreen('signIn');
    });
    let alive = true;
    (async () => {
      try {
        if (await restoreSession()) enter(await getMe());
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) await clearSession();
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => {
      alive = false;
      setSessionExpiredHandler(undefined);
    };
  }, [enter, resetState]);

  const onAuthenticated = (auth: AuthResponse) => enter(auth.user);

  const logout = async () => {
    const refresh = refreshToken();
    setDrawerOpen(false);
    if (refresh) logoutRequest(refresh).catch(() => undefined);
    await clearSession();
    resetState();
    setScreen('signIn');
  };

  // ------------------------------------------------------------------ notifications

  const [notes, setNotes] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const refreshUnread = useCallback(() => {
    getUnreadNotifications().then(setUnread, () => undefined);
  }, []);
  const loadNotes = useCallback(async () => {
    try {
      const list = (await getNotifications()).map(notificationFromApi);
      setNotes(list);
      setUnread(list.filter((n) => !n.read).length);
    } catch {
      // Keep what is on screen; the next poll tries again.
    }
  }, []);

  useEffect(() => {
    if (signedIn) refreshUnread();
  }, [signedIn, refreshUnread]);
  usePolling(refreshUnread, UNREAD_POLL_MS, signedIn);
  usePolling(loadNotes, NOTES_POLL_MS, signedIn && screen === 'notifications');

  const markRead = (id: string) => {
    setNotes((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    markNotificationRead(Number(id)).catch(() => loadNotes());
  };
  const markAllRead = () => {
    setNotes((list) => list.map((n) => ({ ...n, read: true })));
    setUnread(0);
    markAllNotificationsRead().catch(() => loadNotes());
  };

  const openMenu = () => setDrawerOpen(true);
  const openNotifications = () => {
    setReturnTo(screen);
    setScreen('notifications');
    loadNotes();
  };
  const openPlaceholder = (title: string) => {
    setReturnTo(screen);
    setPlaceholderTitle(title);
    setScreen('placeholder');
  };

  // ------------------------------------------------------------------ chat

  const [rawChats, setRawChats] = useState<ApiConversation[]>([]);
  const [chatConv, setChatConv] = useState<Conversation | undefined>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // Where Back goes from a chat that was opened from somewhere other than the Messages tab.
  const [chatReturn, setChatReturn] = useState<Screen | null>(null);

  // The list shows each chat's last message as its preview.
  const conversations = useMemo(
    () =>
      rawChats.map((c) =>
        conversationFromApi(
          c,
          c.last_message
            ? [
                {
                  id: 'last',
                  from: c.last_message.mine ? 'me' : 'them',
                  text: c.last_message.text,
                  time: stampLabel(c.last_message.created_at),
                },
              ]
            : [],
        ),
      ),
    [rawChats],
  );

  const loadConversations = useCallback(async () => {
    try {
      setRawChats(await getConversations());
    } catch {
      // Keep the previous list.
    }
  }, []);
  const loadChat = useCallback(async (id: string) => {
    try {
      setChatMessages((await getMessages(Number(id))).map(messageFromApi));
    } catch {
      // Keep the previous messages.
    }
  }, []);

  const messagesOpen = signedIn && ((screen === 'home' && tab === 'messages') || (screen === 'technicianHome' && techTab === 'messages'));
  useEffect(() => {
    if (messagesOpen) loadConversations();
  }, [messagesOpen, loadConversations]);
  usePolling(loadConversations, CHATS_POLL_MS, messagesOpen);

  // Live messages arrive over a WebSocket while a chat is open. If it can't connect, fall back to
  // asking the server every few seconds so the chat still works.
  const chatSocket = useRef<ReturnType<typeof openChatSocket> | null>(null);
  const [socketOpen, setSocketOpen] = useState(false);
  const myId = profile.id;
  const chatId = screen === 'chat' ? chatConv?.id : undefined;
  useEffect(() => {
    if (!chatId) return;
    const socket = openChatSocket(Number(chatId), {
      onOpen: () => {
        setSocketOpen(true);
        loadChat(chatId); // catch up on anything sent while it was connecting
      },
      onClose: () => setSocketOpen(false),
      onMessage: (m: SocketMessage) =>
        setChatMessages((list) =>
          list.some((x) => x.id === String(m.id))
            ? list
            : [
                ...list,
                {
                  id: String(m.id),
                  from: m.sender_id === myId ? 'me' : 'them',
                  text: m.text,
                  time: stampLabel(m.created_at),
                },
              ],
        ),
    });
    chatSocket.current = socket;
    return () => {
      socket.close();
      chatSocket.current = null;
      setSocketOpen(false);
    };
  }, [chatId, myId, loadChat]);
  usePolling(() => chatConv && loadChat(chatConv.id), CHAT_POLL_MS, screen === 'chat' && !!chatConv && !socketOpen);

  const openChat = (c: Conversation, back: Screen | null = null) => {
    setChatConv({ ...c, messages: [] });
    setChatMessages([]);
    setChatReturn(back);
    setScreen('chat');
    loadChat(c.id).then(loadConversations);
  };
  const sendMessage = async (text: string) => {
    if (!chatConv) return;
    // The server echoes it back over the socket, which is what puts it on screen.
    if (chatSocket.current?.send(text)) return;
    try {
      const sent = await sendMessageRequest(Number(chatConv.id), text);
      setChatMessages((list) => [...list, messageFromApi(sent)]);
    } catch (error) {
      Alert.alert('Message not sent', apiMessage(error));
    }
  };
  /** Opens the chat that belongs to a booking (customer <-> technician). */
  const openBookingChat = async (bookingId: number, back: Screen) => {
    setBusy(true);
    try {
      const list = await getConversations();
      setRawChats(list);
      const found = list.find((c) => c.booking === bookingId);
      if (!found) Alert.alert('Messages', 'The chat opens once a technician has been assigned.');
      else openChat(conversationFromApi(found), back);
    } catch (error) {
      Alert.alert('Messages', apiMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const openSupport = async () => {
    setBusy(true);
    try {
      const support = await openSupportConversation();
      openChat(conversationFromApi(support), screen === 'chat' ? null : screen);
      loadConversations();
    } catch (error) {
      Alert.alert('Help & Support', apiMessage(error));
    } finally {
      setBusy(false);
    }
  };

  // ------------------------------------------------------------------ customer: vehicles, cards, bookings

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // The car used by default when booking; shown with an orange border on Home and in My Vehicles.
  const [defaultVehicleId, setDefaultVehicleId] = useState<string | undefined>();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | undefined>();

  const loadVehicles = useCallback(async () => {
    try {
      const list = await getVehicles();
      setVehicles(list.map(vehicleFromApi));
      setDefaultVehicleId((list.find((v) => v.is_default) ?? list[0])?.id.toString());
    } catch (error) {
      Alert.alert('My Vehicles', apiMessage(error));
    }
  }, []);
  const loadBookings = useCallback(async () => {
    try {
      setBookings(await getBookings());
    } catch {
      // Home just shows no upcoming booking until the next try.
    }
  }, []);
  const loadCards = useCallback(async () => {
    setCardsLoading(true);
    try {
      const list = await getCards();
      setCards(list);
      setSelectedCardId((current) =>
        list.some((c) => c.id === current) ? current : (list.find((c) => c.is_default) ?? list[0])?.id,
      );
    } catch {
      // The payment screen shows "no payment method" and lets the person add one.
    } finally {
      setCardsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signedIn && role === 'customer') {
      loadVehicles();
      loadBookings();
      loadCards();
    }
  }, [signedIn, role, loadVehicles, loadBookings, loadCards]);

  // Coming back to Home picks up bookings that changed (a technician was assigned, it finished...).
  useEffect(() => {
    if (signedIn && role === 'customer' && screen === 'home' && (tab === 'home' || tab === 'profile')) loadBookings();
  }, [signedIn, role, screen, tab, loadBookings]);

  usePolling(loadBookings, BOOKINGS_POLL_MS, signedIn && role === 'customer' && screen === 'home' && tab === 'home');

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => ACTIVE_BOOKING.includes(b.status))
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0] ?? null,
    [bookings],
  );
  const lastAddress = useMemo(
    () => [...bookings].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.address || profile.city,
    [bookings, profile.city],
  );

  const selectDefaultVehicle = (id: string) => {
    setDefaultVehicleId(id);
    makeDefaultVehicle(id).catch(() => loadVehicles());
  };
  const removeVehicle = async (id: string) => {
    try {
      await deleteVehicle(id);
      await loadVehicles();
    } catch (error) {
      Alert.alert('My Vehicles', apiMessage(error));
    }
  };
  /** Saves a vehicle and returns its id. Throws if the server refuses it, so the form can show why. */
  const addVehicle = async (v: NewVehicle) => {
    const created = await createVehicle({
      make: v.make,
      model: v.model,
      year: Number(v.year),
      color: v.color,
      plate: v.plate,
      notes: v.notes,
      photoUri: v.photo,
      is_default: vehicles.length === 0,
    });
    await loadVehicles();
    return String(created.id);
  };

  // ------------------------------------------------------------------ customer: booking flow

  // Where the Add Vehicle form was opened from, so Back/Save return there.
  const [addVehicleFrom, setAddVehicleFrom] = useState<'home' | 'bookingVehicle'>('home');
  const [bookingVehicleId, setBookingVehicleId] = useState<string | undefined>();
  const [draft, setDraft] = useState<BookingDraft>({});
  const updateDraft = (patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch }));
  // A booking created during checkout that still waits for payment.
  const [pendingBooking, setPendingBooking] = useState<ApiBooking | null>(null);

  // What the customer is looking at on the tracking / review screens.
  const [trackBooking, setTrackBooking] = useState<ApiBooking | null>(null);
  const [trackFrom, setTrackFrom] = useState<'home' | 'myBookings'>('home');
  const [reviewFrom, setReviewFrom] = useState<'trackTechnician' | 'myBookings'>('trackTechnician');
  const [rescheduleTarget, setRescheduleTarget] = useState<ApiBooking | null>(null);
  const [paymentFrom, setPaymentFrom] = useState<'bookingPayment' | 'menu'>('menu');

  /** The booking being made, or null until every step has been completed. */
  const summary: BookingSummary | null = (() => {
    const vehicle = vehicles.find((v) => v.id === draft.vehicleId);
    const { plan } = draft;
    if (!vehicle || !plan || !draft.schedule || !draft.location) return null;
    return {
      vehicle,
      packageName: draft.serviceName ?? '',
      planTag: plan.tag,
      price: plan.price,
      date: draft.schedule.date,
      time: draft.schedule.time,
      address: draft.location.address,
      latitude: draft.location.latitude,
      longitude: draft.location.longitude,
    };
  })();
  const trackSummary = useMemo(() => (trackBooking ? summaryFromBooking(trackBooking) : null), [trackBooking]);

  const goHome = () => {
    setTab('home');
    setScreen('home');
  };
  const startBooking = (serviceId?: string, vehicleId?: string) => {
    setDraft(serviceId ? { serviceId } : {});
    setPendingBooking(null);
    setBookingVehicleId(vehicleId);
    setScreen('bookingVehicle');
  };
  const finishCheckout = () => {
    setDraft({});
    setPendingBooking(null);
    goHome();
  };
  const openTrack = (booking: ApiBooking, from: 'home' | 'myBookings') => {
    setTrackBooking(booking);
    setTrackFrom(from);
    setScreen('trackTechnician');
  };
  const openMyBookings = () => {
    setReturnTo(screen === 'myBookings' ? 'home' : screen);
    setScreen('myBookings');
  };
  const openPaymentMethods = (from: 'bookingPayment' | 'menu') => {
    setPaymentFrom(from);
    if (from === 'menu') setReturnTo(screen);
    setScreen('paymentMethods');
    loadCards();
  };
  const reviewTrackedBooking = async () => {
    if (!trackBooking) return;
    setBusy(true);
    try {
      setTrackBooking(await getBooking(trackBooking.id));
      setReviewFrom('trackTechnician');
      setScreen('serviceCompleted');
    } catch (error) {
      Alert.alert('Review', apiMessage(error));
    } finally {
      setBusy(false);
    }
  };

  // ------------------------------------------------------------------ technician

  const [job, setJob] = useState<JobDetail | null>(null);

  const openJob = async (j: Job) => {
    setBusy(true);
    try {
      setJob(jobDetailFromApi(await getJob(j.id)));
      setScreen('jobDetails');
    } catch (error) {
      Alert.alert('Job', apiMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const refreshJob = async () => {
    if (!job) return;
    try {
      setJob(jobDetailFromApi(await getJob(job.id)));
    } catch {
      // Carry on with what we have; the next screen re-reads it when needed.
    }
  };

  // ------------------------------------------------------------------ menus

  const headerProps = { notifications: unread, onMenuPress: openMenu, onNotificationsPress: openNotifications };

  const goTab = (t: TabKey) => () => {
    setTab(t);
    setScreen('home');
  };
  const goTechTab = (t: TabKey) => () => {
    setTechTab(t);
    setScreen('technicianHome');
  };

  /** Pages reachable from the menu and the profile list. Anything not built yet shows a placeholder. */
  const openPage = (title: string) => {
    switch (title) {
      case 'My Bookings':
        openMyBookings();
        break;
      case 'Payment Methods':
        openPaymentMethods('menu');
        break;
      case 'Settings':
      case 'Privacy & Security':
        setReturnTo(screen);
        setScreen('settings');
        break;
      case 'Help & Support':
        if (role === 'customer') openSupport();
        else openPlaceholder(title);
        break;
      default:
        openPlaceholder(title);
    }
  };

  const customerMenu: DrawerItem[] = [
    { key: 'home', label: 'Home', Icon: HomeTabIcon, onPress: goTab('home') },
    { key: 'services', label: 'Services', Icon: BoxTabIcon, onPress: goTab('services') },
    { key: 'vehicles', label: 'My Vehicles', Icon: CarTabIcon, onPress: goTab('vehicles') },
    { key: 'bookings', label: 'My Bookings', Icon: BookingsIcon, onPress: () => openPage('My Bookings') },
    { key: 'notifications', label: 'Notifications', Icon: BellRingIcon, badge: unread, onPress: openNotifications },
    { key: 'payments', label: 'Payment Methods', Icon: CardIcon, onPress: () => openPage('Payment Methods') },
    { key: 'help', label: 'Help & Support', Icon: HelpIcon, onPress: () => openPage('Help & Support') },
    { key: 'settings', label: 'Settings', Icon: SettingsIcon, onPress: () => openPage('Settings') },
  ];
  const technicianMenu: DrawerItem[] = [
    { key: 'home', label: 'Home', Icon: HomeTabIcon, onPress: goTechTab('home') },
    { key: 'jobs', label: 'My Jobs', Icon: BriefcaseIcon, onPress: goTechTab('jobs') },
    { key: 'wallet', label: 'Earnings', Icon: WalletTabIcon, onPress: goTechTab('wallet') },
    { key: 'messages', label: 'Messages', Icon: MessageTabIcon, onPress: goTechTab('messages') },
    { key: 'notifications', label: 'Notifications', Icon: BellRingIcon, badge: unread, onPress: openNotifications },
    { key: 'documents', label: 'Documents', Icon: DocumentIcon, onPress: () => openPage('Documents') },
    { key: 'help', label: 'Help & Support', Icon: HelpIcon, onPress: () => openPage('Help & Support') },
    { key: 'settings', label: 'Settings', Icon: SettingsIcon, onPress: () => openPage('Settings') },
  ];

  if (!fontsLoaded || booting) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null;

  return (
    <>
      {screen === 'splash' && <SplashScreen onGetStarted={() => setScreen('onboarding1')} />}
      {screen === 'onboarding1' && <OnboardingScreen1 onNext={() => setScreen('onboarding2')} />}
      {screen === 'onboarding2' && (
        <OnboardingScreen2 onBack={() => setScreen('onboarding1')} onNext={() => setScreen('signIn')} />
      )}
      {screen === 'selectRole' && (
        // Reached from "Sign up": pick customer or technician, then fill in the sign-up form.
        <SelectRoleScreen
          onContinue={(picked) => {
            setRole(picked);
            setProfile(EMPTY_PROFILE);
            setScreen('signupCustomer');
          }}
        />
      )}
      {screen === 'signupCustomer' && (
        <SignupCustomerScreen
          role={role}
          onSignUp={onAuthenticated}
          onSignIn={() => setScreen('signIn')}
          onGoogle={onAuthenticated}
        />
      )}
      {screen === 'signIn' && (
        <SignInScreen
          onSignIn={onAuthenticated}
          onSignUp={() => setScreen('selectRole')}
          onGoogle={onAuthenticated}
          onForgotPassword={() => setScreen('forgotPassword')}
        />
      )}
      {screen === 'forgotPassword' && (
        <ForgotPasswordScreen onBack={() => setScreen('signIn')} onDone={() => setScreen('signIn')} />
      )}
      {screen === 'home' && (
        <MainShell tab={tab} onTabChange={setTab}>
          {tab === 'home' && (
            <HomeScreen
              notifications={unread}
              onMenuPress={openMenu}
              onNotificationsPress={openNotifications}
              vehicles={vehicles}
              selectedVehicleId={defaultVehicleId}
              onSelectVehicle={selectDefaultVehicle}
              onAddVehicle={() => {
                setAddVehicleFrom('home');
                setScreen('addVehicle');
              }}
              onBookService={() => startBooking()}
              upcoming={upcoming}
              onOpenBooking={(b) => openTrack(b, 'home')}
              onViewAllBookings={openMyBookings}
              address={lastAddress}
            />
          )}
          {tab === 'services' && (
            <ServicesScreen
              onBookService={(service) => startBooking(service.id)}
              notifications={unread}
              onMenuPress={openMenu}
              onNotificationsPress={openNotifications}
            />
          )}
          {tab === 'vehicles' && (
            <MyVehiclesScreen
              vehicles={vehicles}
              defaultId={defaultVehicleId}
              onSelect={selectDefaultVehicle}
              onRemove={removeVehicle}
              onAdd={() => {
                setAddVehicleFrom('home');
                setScreen('addVehicle');
              }}
              onBook={(v) => startBooking(undefined, v.id)}
              {...headerProps}
            />
          )}
          {tab === 'messages' && (
            <MessagesScreen
              conversations={conversations}
              subtitle="Chat with your technician and our support team"
              onOpen={(c) => openChat(c)}
              {...headerProps}
            />
          )}
          {tab === 'profile' && (
            <CustomerProfileScreen
              profile={profile}
              vehicleCount={vehicles.length}
              bookingCount={bookings.length}
              reviewCount={bookings.filter((b) => b.review).length}
              onEditProfile={() => setScreen('editProfile')}
              onOpenVehicles={() => setTab('vehicles')}
              onOpenPage={openPage}
              onLogout={logout}
              {...headerProps}
            />
          )}
        </MainShell>
      )}
      {screen === 'technicianHome' && (
        <MainShell tab={techTab} onTabChange={setTechTab} tabs={TECHNICIAN_TABS}>
          {techTab === 'home' && (
            <TechnicianHomeScreen
              name={profile.name.split(' ')[0]}
              notifications={unread}
              onMenuPress={openMenu}
              onNotificationsPress={openNotifications}
              onOpenJob={openJob}
              onViewAllJobs={() => setTechTab('jobs')}
            />
          )}
          {techTab === 'jobs' && <MyJobsScreen onOpenJob={openJob} {...headerProps} />}
          {techTab === 'wallet' && <EarningsScreen {...headerProps} />}
          {techTab === 'messages' && <MessagesScreen conversations={conversations} onOpen={(c) => openChat(c)} {...headerProps} />}
          {techTab === 'profile' && (
            <TechnicianProfileScreen
              profile={profile}
              onEditProfile={() => setScreen('editProfile')}
              onOpenPage={openPage}
              onLogout={logout}
              {...headerProps}
            />
          )}
        </MainShell>
      )}
      {screen === 'jobDetails' && job && (
        <JobDetailsScreen
          job={job}
          onBack={() => setScreen('technicianHome')}
          onStart={async () => {
            await refreshJob();
            setScreen('inRoute');
          }}
          onContinueService={() => setScreen('serviceProgress')}
          onMessageCustomer={() => openBookingChat(Number(job.id), 'jobDetails')}
        />
      )}
      {screen === 'inRoute' && job && (
        <InRouteScreen
          job={job}
          onBack={() => setScreen('jobDetails')}
          onArrived={async () => {
            await refreshJob();
            setScreen('serviceProgress');
          }}
          onMessageCustomer={() => openBookingChat(Number(job.id), 'inRoute')}
        />
      )}
      {screen === 'serviceProgress' && job && (
        <ServiceProgressScreen
          key={job.id}
          job={job}
          onBack={() => setScreen('jobDetails')}
          onFinish={() => {
            setTechTab('home');
            setScreen('technicianHome');
          }}
        />
      )}
      {screen === 'addVehicle' && (
        <AddVehicleScreen
          onBack={() => setScreen(addVehicleFrom)}
          onSave={async (v) => {
            const id = await addVehicle(v);
            if (addVehicleFrom === 'bookingVehicle') setBookingVehicleId(id);
            setScreen(addVehicleFrom);
          }}
          onBookService={async (v) => {
            setBookingVehicleId(await addVehicle(v));
            setScreen('bookingVehicle');
          }}
        />
      )}
      {screen === 'bookingVehicle' && (
        <BookingVehicleScreen
          // Remount when a vehicle is added so the new one is pre-selected.
          key={bookingVehicleId ?? 'none'}
          vehicles={vehicles}
          initialVehicleId={bookingVehicleId ?? defaultVehicleId}
          onBack={() => setScreen('home')}
          onAddVehicle={() => {
            setAddVehicleFrom('bookingVehicle');
            setScreen('addVehicle');
          }}
          onContinue={(v) => {
            setBookingVehicleId(v.id);
            updateDraft({ vehicleId: v.id });
            setScreen('bookingService');
          }}
        />
      )}
      {screen === 'bookingService' && (
        <BookingServiceScreen
          serviceId={draft.serviceId}
          onBack={() => setScreen('bookingVehicle')}
          onContinue={({ serviceId, serviceName, plan }) => {
            // A different plan means a different price: a booking waiting for payment is no longer right.
            setPendingBooking(null);
            updateDraft({ serviceId, serviceName, plan });
            setScreen('bookingSchedule');
          }}
        />
      )}
      {screen === 'bookingSchedule' && (
        <BookingScheduleScreen
          onBack={() => setScreen('bookingService')}
          onContinue={(schedule) => {
            setPendingBooking(null);
            updateDraft({ schedule });
            setScreen('bookingLocation');
          }}
        />
      )}
      {screen === 'bookingLocation' && (
        <BookingLocationScreen
          onBack={() => setScreen('bookingSchedule')}
          onContinue={(location) => {
            setPendingBooking(null);
            updateDraft({ location });
            setScreen('bookingPayment');
            loadCards();
          }}
        />
      )}
      {screen === 'bookingPayment' && summary && draft.plan && (
        <BookingPaymentScreen
          summary={summary}
          vehicleId={Number(draft.vehicleId)}
          planId={Number(draft.plan.id)}
          card={selectedCard}
          cardsLoading={cardsLoading}
          technician={draft.technician}
          onChangeTechnician={() => setScreen('technicians')}
          pendingBooking={pendingBooking}
          onCreated={setPendingBooking}
          onBack={() => setScreen('bookingLocation')}
          onChangeVehicle={() => setScreen('bookingVehicle')}
          onChangeCard={() => openPaymentMethods('bookingPayment')}
          onBooked={(booking) => {
            setTrackBooking(booking);
            loadBookings();
          }}
          onHome={finishCheckout}
          onViewBooking={() => {
            setDraft({});
            setPendingBooking(null);
            setTrackFrom('home');
            setScreen('trackTechnician');
          }}
        />
      )}
      {screen === 'technicians' && draft.schedule && (
        <TechniciansScreen
          scheduledAt={scheduleToIso(draft.schedule.date, draft.schedule.time)}
          planId={draft.plan ? Number(draft.plan.id) : undefined}
          selectedId={draft.technician?.id}
          onBack={() => setScreen('bookingPayment')}
          onSelect={(technician) => {
            // A booking already created for someone else no longer matches.
            setPendingBooking(null);
            updateDraft({ technician });
            setScreen('bookingPayment');
          }}
        />
      )}
      {screen === 'paymentMethods' && (
        <PaymentMethodsScreen
          selectedId={selectedCardId}
          onSelect={
            paymentFrom === 'bookingPayment'
              ? (card) => {
                  setSelectedCardId(card.id);
                  setScreen('bookingPayment');
                }
              : undefined
          }
          onChanged={loadCards}
          startAdding={paymentFrom === 'bookingPayment' && cards.length === 0}
          onBack={() => setScreen(paymentFrom === 'bookingPayment' ? 'bookingPayment' : returnTo)}
        />
      )}
      {screen === 'trackTechnician' && trackSummary && (
        <TrackTechnicianScreen
          key={trackBooking?.id}
          summary={trackSummary}
          booking={trackBooking ?? undefined}
          onBack={() => (trackFrom === 'myBookings' ? setScreen('myBookings') : goHome())}
          onReview={reviewTrackedBooking}
          onMessage={() => trackBooking && openBookingChat(trackBooking.id, 'trackTechnician')}
        />
      )}
      {screen === 'serviceCompleted' && trackSummary && (
        <ServiceCompletedScreen
          summary={trackSummary}
          booking={trackBooking ?? undefined}
          onBack={() => setScreen(reviewFrom)}
          onMessage={() => trackBooking && openBookingChat(trackBooking.id, 'serviceCompleted')}
          onComplete={() => {
            loadBookings();
            if (reviewFrom === 'myBookings') setScreen('myBookings');
            else goHome();
          }}
        />
      )}
      {screen === 'myBookings' && (
        <MyBookingsScreen
          onBack={() => setScreen(returnTo)}
          onTrack={(b) => openTrack(b, 'myBookings')}
          onReview={(b) => {
            setTrackBooking(b);
            setReviewFrom('myBookings');
            setScreen('serviceCompleted');
          }}
          onReschedule={(b) => {
            setRescheduleTarget(b);
            setScreen('reschedule');
          }}
        />
      )}
      {screen === 'reschedule' && rescheduleTarget && (
        <BookingScheduleScreen
          onBack={() => setScreen('myBookings')}
          onContinue={async ({ date, time }) => {
            try {
              await rescheduleBooking(rescheduleTarget.id, scheduleToIso(date, time));
              loadBookings();
              setScreen('myBookings');
            } catch (error) {
              Alert.alert('Reschedule', apiMessage(error));
            }
          }}
        />
      )}
      {screen === 'settings' && <SettingsScreen onBack={() => setScreen(returnTo)} />}
      {screen === 'notifications' && (
        <NotificationsScreen
          notifications={notes}
          onBack={() => setScreen(returnTo)}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />
      )}
      {screen === 'editProfile' && (
        <EditProfileScreen
          profile={profile}
          role={role}
          onBack={() => setScreen(role === 'technician' ? 'technicianHome' : 'home')}
          onSave={setProfile}
        />
      )}
      {screen === 'chat' && chatConv && (
        <ChatScreen
          conversation={{ ...chatConv, messages: chatMessages }}
          onBack={() => {
            loadConversations();
            if (chatReturn) setScreen(chatReturn);
            else if (role === 'technician') {
              setTechTab('messages');
              setScreen('technicianHome');
            } else {
              setTab('messages');
              setScreen('home');
            }
          }}
          onSend={sendMessage}
        />
      )}
      {screen === 'placeholder' && <PlaceholderScreen title={placeholderTitle} onBack={() => setScreen(returnTo)} />}

      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={{
          name: profile.name,
          photo: profile.photo,
          subtitle: role === 'technician' ? 'Technician' : profile.email || 'Customer',
        }}
        items={role === 'technician' ? technicianMenu : customerMenu}
        activeKey={role === 'technician' ? techTab : tab}
        onLogout={logout}
      />
      <AlertHost />
      {busy && (
        <View style={styles.busy} pointerEvents="auto">
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  busy: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(16,20,24,0.5)' },
});
