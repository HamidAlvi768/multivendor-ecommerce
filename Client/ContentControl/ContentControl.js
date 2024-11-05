import { createContext, useContext, useEffect, useState } from "react";
import { userCheck } from "@/Config/Server";

const ContentControl = createContext();

export function ContentProvider({ children }) {
    const [userLogged, setUserLogged] = useState({ status: false });
    const [LoginModal, setLoginModal] = useState({
        btn: false,
        active: false,
        member: true,
        forgot: false,
    });
    const [QuickVw, setQuickVw] = useState({
        active: false,
        btn: false,
        product: {}
    });
    const [cartTotal, setCartTotal] = useState(0);
    const [venderLogged, setVendorLogged] = useState({ status: false });
    const [adminLogged, setAdminLogged] = useState({ status: false });

    // Check auth status on mount and token change
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userCheck(token, (data) => {
                console.log('Auth check response:', data);
                setUserLogged(data);
            });
        }
    }, []);

    // Persist important state changes to localStorage
    useEffect(() => {
        if (!userLogged.status) {
            localStorage.removeItem('token');
        }
    }, [userLogged.status]);

    const value = {
        userLogged,
        setUserLogged,
        LoginModal,
        setLoginModal,
        QuickVw,
        setQuickVw,
        cartTotal,
        setCartTotal,
        venderLogged,
        setVendorLogged,
        adminLogged,
        setAdminLogged
    };

    return (
        <ContentControl.Provider value={value}>
            {children}
        </ContentControl.Provider>
    );
}

export function useContentControl() {
    const context = useContext(ContentControl);
    if (!context) {
        throw new Error("useContentControl must be used within ContentProvider");
    }
    return context;
}

export default ContentControl;