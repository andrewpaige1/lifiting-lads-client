import { createContext, useState, ReactNode } from 'react';

// Create the context with an initial value of { climateCredit: 0, userInfo: null }
export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Set initial values for both userInfo and climateCredit
  const [userInfo, setUserInfo] = useState(null); // User information state
  const [climateCredit, setClimateCredit] = useState(0); // Initialize climateCredit to 0

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, climateCredit, setClimateCredit }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
