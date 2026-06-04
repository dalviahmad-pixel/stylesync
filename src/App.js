import React, { useState } from 'react';
import SignUp from './components/SignUp';
import Welcome from './components/Welcome';
import MyWardrobe from './components/MyWardrobe';
import OutfitSuggestions from './components/OutfitSuggestions';
import EventCalendar from './components/EventCalendar';
import Confirmation from './components/Confirmation';

function App() {
  const [currentScreen, setCurrentScreen] = useState('signup');
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signup':
        return <SignUp onNext={() => navigateTo('welcome')} onUserDataChange={setUserData} />;
      case 'welcome':
        return <Welcome userName={userData.name} onNext={() => navigateTo('wardrobe')} />;
      case 'wardrobe':
        return <MyWardrobe onNext={() => navigateTo('outfits')} />;
      case 'outfits':
        return <OutfitSuggestions onNext={() => navigateTo('calendar')} />;
      case 'calendar':
        return <EventCalendar onNext={() => navigateTo('confirmation')} />;
      case 'confirmation':
        return <Confirmation onGoHome={() => navigateTo('signup')} />;
      default:
        return <SignUp onNext={() => navigateTo('wardrobe')} onUserDataChange={setUserData} />;
    }
  };

  return (
    <div>
      <header className="header">
        <h1>StyleSync</h1>
        <p>Your AI Wardrobe Assistant</p>
      </header>
      
      <main className="container">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;