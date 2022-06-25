// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import {UserContext} from "./hooks/UserContext"
import useFindUser from './hooks/useFindUser';

// ----------------------------------------------------------------------

export default function App() {
  const { 
    user, 
    setUser,
    isLoading } = useFindUser();
  return (
    
      <ThemeConfig>
        
          <ScrollToTop />
          <GlobalStyles />
          <BaseOptionChartStyle />
          <UserContext.Provider value={{ user, setUser, isLoading}}>
            <Router />
          </UserContext.Provider>
      </ThemeConfig>
    
  );
}
