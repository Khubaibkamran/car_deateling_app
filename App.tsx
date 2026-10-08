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
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
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
import { EXTERIOR_WASH } from './src/data/packages';
import { SAMPLE_JOB_DETAIL } from './src/data/jobDetails';
import { CONVERSATIONS, Conversation, CUSTOMER_CONVERSATIONS } from './src/data/messages';
import { AppNotification, CUSTOMER_NOTIFICATIONS, TECHNICIAN_NOTIFICATIONS } from './src/data/notifications';
import { TECHNICIAN_NAME, TECHNICIAN_STATS, TechnicianStats } from './src/data/jobs';
import { INITIAL_VEHICLES } from './src/data/vehicles';
import { BookingSummary } from './src/types/booking';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignupCustomerScreen from './src/screens/auth/SignupCustomerScreen';
import { nameFromEmail } from './src/utils/names';
import BookingLocationScreen, { BookingLocation } from './src/screens/booking/BookingLocationScreen';
import BookingScheduleScreen, { Schedule } from './src/screens/booking/BookingScheduleScreen';
import BookingPaymentScreen from './src/screens/booking/BookingPaymentScreen';
import BookingServiceScreen from './src/screens/booking/BookingServiceScreen';
import TrackTechnicianScreen from './src/screens/booking/TrackTechnicianScreen';
import BookingVehicleScreen from './src/screens/booking/BookingVehicleScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import MainShell from './src/screens/main/MainShell';
import ServiceCompletedScreen from './src/screens/booking/ServiceCompletedScreen';
import ServicesScreen from './src/screens/services/ServicesScreen';
import PlaceholderScreen from './src/screens/main/PlaceholderScreen';
import NotificationsScreen from './src/screens/notifications/NotificationsScreen';
import CustomerProfileScreen from './src/screens/profile/CustomerProfileScreen';
import MyVehiclesScreen from './src/screens/vehicles/MyVehiclesScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import ChatScreen from './src/screens/technician/ChatScreen';
import EarningsScreen from './src/screens/technician/EarningsScreen';
import MessagesScreen from './src/screens/technician/MessagesScreen';
import MyJobsScreen from './src/screens/technician/MyJobsScreen';
import TechnicianProfileScreen from './src/screens/technician/TechnicianProfileScreen';
import InRouteScreen from './src/screens/technician/InRouteScreen';
import JobDetailsScreen from './src/screens/technician/JobDetailsScreen';
import ServiceProgressScreen from './src/screens/technician/ServiceProgressScreen';
import TechnicianHomeScreen from './src/screens/technician/TechnicianHomeScreen';
import OnboardingScreen1 from './src/screens/onboarding/OnboardingScreen1';
import OnboardingScreen2 from './src/screens/onboarding/OnboardingScreen2';
import SelectRoleScreen from './src/screens/role/SelectRoleScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import AddVehicleScreen, { NewVehicle } from './src/screens/vehicles/AddVehicleScreen';
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
  packageId?: string;
  planId?: string;
  schedule?: Schedule;
  location?: BookingLocation;
};

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
  const [screen, setScreen] = useState<Screen>('splash');
  // Which bottom-nav tab is showing while `screen` is 'home' (the main tab area).
  const [tab, setTab] = useState<TabKey>('home');
  // The technician app has its own set of tabs.
  const [techTab, setTechTab] = useState<TabKey>('home');
  const [techStats, setTechStats] = useState<TechnicianStats>(TECHNICIAN_STATS);

  // Who is using the app: decides which menu, notifications and profile to show.
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Technician chats, kept here so a sent message is still there when you come back.
  const [techChats, setTechChats] = useState<Conversation[]>(CONVERSATIONS);
  const [customerChats, setCustomerChats] = useState<Conversation[]>(CUSTOMER_CONVERSATIONS);
  const conversations = role === 'technician' ? techChats : customerChats;
  const setConversations = role === 'technician' ? setTechChats : setCustomerChats;
  const [chatId, setChatId] = useState<string | undefined>();
  const [customerNotes, setCustomerNotes] = useState<AppNotification[]>(CUSTOMER_NOTIFICATIONS);
  const [techNotes, setTechNotes] = useState<AppNotification[]>(TECHNICIAN_NOTIFICATIONS);
  // Where the notifications / placeholder pages should return to.
  const [returnTo, setReturnTo] = useState<Screen>('home');
  const [placeholderTitle, setPlaceholderTitle] = useState('');

  const notes = role === 'technician' ? techNotes : customerNotes;
  const setNotes = role === 'technician' ? setTechNotes : setCustomerNotes;
  const unread = notes.filter((n) => !n.read).length;
  const markRead = (id: string) => setNotes((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotes((list) => list.map((n) => ({ ...n, read: true })));

  const openChat = (c: Conversation) => {
    setChatId(c.id);
    // Opening a chat reads it.
    setConversations((list) => list.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
    setScreen('chat');
  };
  const sendMessage = (id: string, text: string) => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const time = `${hours}:${`${now.getMinutes()}`.padStart(2, '0')} ${now.getHours() < 12 ? 'AM' : 'PM'}`;
    setConversations((list) =>
      list.map((x) =>
        x.id === id ? { ...x, messages: [...x.messages, { id: `${Date.now()}`, from: 'me', text, time }] } : x,
      ),
    );
  };

  const openMenu = () => setDrawerOpen(true);
  const openNotifications = () => {
    setReturnTo(screen);
    setScreen('notifications');
  };
  const openPlaceholder = (title: string) => {
    setReturnTo(screen);
    setPlaceholderTitle(title);
    setScreen('placeholder');
  };
  // Back to the role picker. There's no real session yet, so this just resets the app's navigation state.
  const logout = () => {
    setDrawerOpen(false);
    setTab('home');
    setTechTab('home');
    setScreen('selectRole');
  };
  // Same landing as a normal sign-in, using the name and email Google gave us.
  const finishGoogleSignIn = ({ email, name }: { email: string; name: string }) => {
    setProfile((p) => ({ ...p, email, name: name || nameFromEmail(email) }));
    if (role === 'technician') setScreen('technicianHome');
    else goHome();
  };

  const goHome = () => {
    setTab('home');
    setScreen('home');
  };
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  // The car used by default when booking; shown with an orange border on Home and in My Vehicles.
  const [defaultVehicleId, setDefaultVehicleId] = useState<string | undefined>(INITIAL_VEHICLES[0]?.id);
  const removeVehicle = (id: string) => {
    const left = vehicles.filter((v) => v.id !== id);
    setVehicles(left);
    if (defaultVehicleId === id) setDefaultVehicleId(left[0]?.id);
  };
  // Where the Add Vehicle form was opened from, so Back/Save return there.
  const [addVehicleFrom, setAddVehicleFrom] = useState<'home' | 'bookingVehicle'>('home');
  // The booking in progress.
  const [bookingVehicleId, setBookingVehicleId] = useState<string | undefined>();
  const [draft, setDraft] = useState<BookingDraft>({});
  const updateDraft = (patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  /** Adds a vehicle and returns its id. */
  const addVehicle = (v: NewVehicle) => {
    const id = `${Date.now()}`;
    setVehicles((list) => [
      ...list,
      {
        id,
        name: [v.make, v.model].filter(Boolean).join(' '),
        year: v.year,
        color: v.color,
        plate: v.plate,
        notes: v.notes,
      },
    ]);
    return id;
  };

  /** The finished booking, or null until every step has been completed. */
  const summary: BookingSummary | null = (() => {
    const vehicle = vehicles.find((v) => v.id === draft.vehicleId);
    const plan = EXTERIOR_WASH.plans.find((p) => p.id === draft.planId);
    if (!vehicle || !plan || !draft.schedule || !draft.location) return null;
    return {
      vehicle,
      packageName: EXTERIOR_WASH.name,
      planTag: plan.tag,
      price: plan.price,
      date: draft.schedule.date,
      time: draft.schedule.time,
      address: draft.location.address,
      latitude: draft.location.latitude,
      longitude: draft.location.longitude,
    };
  })();

  const startBooking = () => {
    setBookingVehicleId(undefined);
    setScreen('bookingVehicle');
  };

  const headerProps = { notifications: unread, onMenuPress: openMenu, onNotificationsPress: openNotifications };

  const goTab = (t: TabKey) => () => {
    setTab(t);
    setScreen('home');
  };
  const goTechTab = (t: TabKey) => () => {
    setTechTab(t);
    setScreen('technicianHome');
  };

  const customerMenu: DrawerItem[] = [
    { key: 'home', label: 'Home', Icon: HomeTabIcon, onPress: goTab('home') },
    { key: 'services', label: 'Services', Icon: BoxTabIcon, onPress: goTab('services') },
    { key: 'vehicles', label: 'My Vehicles', Icon: CarTabIcon, onPress: goTab('vehicles') },
    { key: 'bookings', label: 'My Bookings', Icon: BookingsIcon, onPress: () => openPlaceholder('My Bookings') },
    { key: 'notifications', label: 'Notifications', Icon: BellRingIcon, badge: unread, onPress: openNotifications },
    { key: 'payments', label: 'Payment Methods', Icon: CardIcon, onPress: () => openPlaceholder('Payment Methods') },
    { key: 'help', label: 'Help & Support', Icon: HelpIcon, onPress: () => openPlaceholder('Help & Support') },
    { key: 'settings', label: 'Settings', Icon: SettingsIcon, onPress: () => openPlaceholder('Settings') },
  ];
  const technicianMenu: DrawerItem[] = [
    { key: 'home', label: 'Home', Icon: HomeTabIcon, onPress: goTechTab('home') },
    { key: 'jobs', label: 'My Jobs', Icon: BriefcaseIcon, onPress: goTechTab('jobs') },
    { key: 'wallet', label: 'Earnings', Icon: WalletTabIcon, onPress: goTechTab('wallet') },
    { key: 'messages', label: 'Messages', Icon: MessageTabIcon, onPress: goTechTab('messages') },
    { key: 'notifications', label: 'Notifications', Icon: BellRingIcon, badge: unread, onPress: openNotifications },
    { key: 'documents', label: 'Documents', Icon: DocumentIcon, onPress: () => openPlaceholder('Documents') },
    { key: 'help', label: 'Help & Support', Icon: HelpIcon, onPress: () => openPlaceholder('Help & Support') },
    { key: 'settings', label: 'Settings', Icon: SettingsIcon, onPress: () => openPlaceholder('Settings') },
  ];

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <>
      {screen === 'splash' && <SplashScreen onGetStarted={() => setScreen('onboarding1')} />}
      {screen === 'onboarding1' && <OnboardingScreen1 onNext={() => setScreen('onboarding2')} />}
      {screen === 'onboarding2' && (
        <OnboardingScreen2 onBack={() => setScreen('onboarding1')} onNext={() => setScreen('selectRole')} />
      )}
      {screen === 'selectRole' && (
        // Customers start at the sign-up design; technicians have no sign-up design yet, so they start at sign in.
        <SelectRoleScreen
          onContinue={(picked) => {
            setRole(picked);
            setProfile(EMPTY_PROFILE);
            setScreen(picked === 'technician' ? 'signIn' : 'signupCustomer');
          }}
        />
      )}
      {screen === 'signupCustomer' && (
        <SignupCustomerScreen
          role={role}
          onSignUp={(values) => {
            setProfile({ ...EMPTY_PROFILE, name: values.fullName || (role === 'technician' ? 'Technician' : 'Customer'), email: values.email });
            if (role === 'technician') setScreen('technicianHome');
            else goHome();
          }}
          onSignIn={() => setScreen('signIn')}
          onGoogle={finishGoogleSignIn}
        />
      )}
      {screen === 'signIn' && (
        <SignInScreen
          role={role}
          onSignIn={(email) => {
            // No account server yet, so the name comes from the email address.
            setProfile((p) => ({ ...p, email, name: p.name !== EMPTY_PROFILE.name ? p.name : nameFromEmail(email) }));
            if (role === 'technician') setScreen('technicianHome');
            else goHome();
          }}
          onSignUp={() => setScreen('signupCustomer')}
          onGoogle={finishGoogleSignIn}
          onForgotPassword={() => setScreen('forgotPassword')}
        />
      )}
      {screen === 'forgotPassword' && (
        <ForgotPasswordScreen role={role} onBack={() => setScreen('signIn')} onDone={() => setScreen('signIn')} />
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
              onSelectVehicle={setDefaultVehicleId}
              onAddVehicle={() => {
                setAddVehicleFrom('home');
                setScreen('addVehicle');
              }}
              onBookService={startBooking}
            />
          )}
          {tab === 'services' && (
            // The booking flow still offers a single package, so every service starts the same flow for now.
            <ServicesScreen
              onBookService={startBooking}
              notifications={unread}
              onMenuPress={openMenu}
              onNotificationsPress={openNotifications}
            />
          )}
          {tab === 'vehicles' && (
            <MyVehiclesScreen
              vehicles={vehicles}
              defaultId={defaultVehicleId}
              onSelect={setDefaultVehicleId}
              onRemove={removeVehicle}
              onAdd={() => {
                setAddVehicleFrom('home');
                setScreen('addVehicle');
              }}
              onBook={(v) => {
                setBookingVehicleId(v.id);
                setScreen('bookingVehicle');
              }}
              {...headerProps}
            />
          )}
          {tab === 'messages' && (
            <MessagesScreen
              conversations={conversations}
              subtitle="Chat with your technician and our support team"
              onOpen={openChat}
              {...headerProps}
            />
          )}
          {tab === 'profile' && (
            <CustomerProfileScreen
              profile={profile}
              vehicleCount={vehicles.length}
              onEditProfile={() => setScreen('editProfile')}
              onOpenVehicles={() => setTab('vehicles')}
              onOpenPage={openPlaceholder}
              onLogout={logout}
              {...headerProps}
            />
          )}
        </MainShell>
      )}
      {screen === 'technicianHome' && (
        <MainShell tab={techTab} onTabChange={setTechTab} tabs={TECHNICIAN_TABS}>
          {techTab === 'home' && (
            // Every job opens the same sample detail until jobs come from the backend.
            <TechnicianHomeScreen
              name={profile.name.split(' ')[0]}
              notifications={unread}
              onMenuPress={openMenu}
              onNotificationsPress={openNotifications}
              stats={techStats}
              onOpenJob={() => setScreen('jobDetails')}
              onViewAllJobs={() => setTechTab('jobs')}
            />
          )}
          {techTab === 'jobs' && <MyJobsScreen onOpenJob={() => setScreen('jobDetails')} {...headerProps} />}
          {techTab === 'wallet' && <EarningsScreen {...headerProps} />}
          {techTab === 'messages' && (
            <MessagesScreen conversations={conversations} onOpen={openChat} {...headerProps} />
          )}
          {techTab === 'profile' && (
            <TechnicianProfileScreen
              profile={profile}
              onEditProfile={() => setScreen('editProfile')}
              onOpenPage={openPlaceholder}
              onLogout={logout}
              {...headerProps}
            />
          )}
        </MainShell>
      )}
      {screen === 'jobDetails' && (
        <JobDetailsScreen
          job={SAMPLE_JOB_DETAIL}
          onBack={() => setScreen('technicianHome')}
          onStart={() => setScreen('inRoute')}
        />
      )}
      {screen === 'inRoute' && (
        <InRouteScreen
          job={SAMPLE_JOB_DETAIL}
          onBack={() => setScreen('jobDetails')}
          onArrived={() => setScreen('serviceProgress')}
        />
      )}
      {screen === 'serviceProgress' && (
        <ServiceProgressScreen
          job={SAMPLE_JOB_DETAIL}
          onBack={() => setScreen('inRoute')}
          onFinish={() => {
            // Count the finished job in today's numbers (kept in memory only until the backend exists).
            setTechStats((st) => ({
              ...st,
              completed: st.completed + 1,
              earningsToday: st.earningsToday + SAMPLE_JOB_DETAIL.price,
            }));
            setTechTab('home');
            setScreen('technicianHome');
          }}
        />
      )}
      {screen === 'addVehicle' && (
        <AddVehicleScreen
          onBack={() => setScreen(addVehicleFrom)}
          onSave={(v) => {
            const id = addVehicle(v);
            if (addVehicleFrom === 'bookingVehicle') setBookingVehicleId(id);
            setScreen(addVehicleFrom);
          }}
          onBookService={(v) => {
            setBookingVehicleId(addVehicle(v));
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
          onBack={() => setScreen('bookingVehicle')}
          onContinue={({ packageId, planId }) => {
            updateDraft({ packageId, planId });
            setScreen('bookingSchedule');
          }}
        />
      )}
      {screen === 'bookingSchedule' && (
        <BookingScheduleScreen
          onBack={() => setScreen('bookingService')}
          onContinue={(schedule) => {
            updateDraft({ schedule });
            setScreen('bookingLocation');
          }}
        />
      )}
      {screen === 'bookingLocation' && (
        <BookingLocationScreen
          onBack={() => setScreen('bookingSchedule')}
          onContinue={(location) => {
            updateDraft({ location });
            setScreen('bookingPayment');
          }}
        />
      )}
      {screen === 'bookingPayment' && summary && (
        <BookingPaymentScreen
          summary={summary}
          onBack={() => setScreen('bookingLocation')}
          onChangeVehicle={() => setScreen('bookingVehicle')}
          onHome={goHome}
          onViewBooking={() => setScreen('trackTechnician')}
        />
      )}
      {screen === 'trackTechnician' && summary && (
        <TrackTechnicianScreen
          summary={summary}
          onBack={goHome}
          onReview={() => setScreen('serviceCompleted')}
        />
      )}
      {screen === 'serviceCompleted' && summary && (
        // The feedback isn't stored anywhere yet; once the backend exists it will be sent with the job.
        <ServiceCompletedScreen
          summary={summary}
          onBack={() => setScreen('trackTechnician')}
          onComplete={goHome}
        />
      )}
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
      {screen === 'chat' && conversations.find((c) => c.id === chatId) && (
        <ChatScreen
          conversation={conversations.find((c) => c.id === chatId)!}
          onBack={() => {
            if (role === 'technician') {
              setTechTab('messages');
              setScreen('technicianHome');
            } else {
              setTab('messages');
              setScreen('home');
            }
          }}
          onSend={(text) => chatId && sendMessage(chatId, text)}
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
      <StatusBar style="light" />
    </>
  );
}
