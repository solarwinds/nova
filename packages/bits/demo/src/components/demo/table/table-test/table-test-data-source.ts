export interface ITestTableModel {
    position: number;
    name: string;
    features: any;
    asset: string;
    location: string;
    status: string;
    outages: number;
    checks: any;
}

export const ELEMENT_DATA: ITestTableModel[] = [
    {
        position: 1,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_up",
            num: 25,
        }],
    },
    {
        position: 2,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_critical",
            num: 25,
        }],
    },
    {
        position: 3,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_down",
            num: 25,
        }],
    },
    {
        position: 4,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_up",
            num: 25,
        }],
    },
    {
        position: 5,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_up",
            num: 25,
        }],
    },
    {
        position: 6,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_mixed",
            num: 25,
        }],
    },
    {
        position: 7,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_external",
            num: 25,
        }],
    },
    {
        position: 8,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_inactive",
            num: 25,
        }],
    },
    {
        position: 9,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_up",
            num: 25,
        }],
    },
    {
        position: 10,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_up",
            num: 25,
        }],
    },
    {
        position: 11,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_external",
            num: 25,
        }],
    },
    {
        position: 12,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_up",
            num: 25,
        }],
    },
    {
        position: 13,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_inactive",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_external",
            num: 25,
        }],
    },
    {
        position: 14,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_inactive",
            num: 25,
        }],
    },
    {
        position: 15,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        asset: "Workstation",
        location: "Brno",
        status: "status_up",
        outages: Math.floor(Math.random() * 100),
        checks: [{
            icon: "status_external",
            num: 25,
        }],
    },
];
