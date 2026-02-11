export interface Case {
  id: string;
  serverId: string;
  status: 'Pending' | 'In Progress' | 'Solved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  assignedAnalyst: string;
  description: string;
  caseType: string;
  user: {
    name: string;
    email: string;
    role: string;
    id: string;
  };
  evidence: {
    name: string;
    type: string;
    size: string;
    date: string;
  }[];
  timeline: {
    event: string;
    timestamp: string;
    user: string;
  }[];
}

export interface Playbook {
  id: string;
  caseId: string;
  summary: string;
  status: 'Draft' | 'Approved' | 'Applied';
  steps: {
    id: string;
    title: string;
    description: string;
  }[];
  commands: {
    id: string;
    command: string;
    description: string;
  }[];
}

export interface Report {
  id: string;
  caseId: string;
  userDetails: string;
  status: 'Draft' | 'Final';
  sentToUser: boolean;
  resolution: string;
  aiSuggestedResolution: string;
  date: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'Info' | 'Warning' | 'Critical';
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

export const mockCases: Case[] = [
  {
    id: "CASE-001",
    serverId: "SRV-992",
    status: "In Progress",
    priority: "High",
    deadline: "2024-03-20",
    assignedAnalyst: "Sajith",
    caseType: "Unauthorized Access",
    description: "Suspicious login attempt detected from unknown IP range 192.168.1.50 on production database server.",
    user: {
      name: "Sarah Williams",
      email: "sarah.w@defense.gov",
      role: "Database Admin",
      id: "USER-442"
    },
    evidence: [
      { name: "auth_logs.csv", type: "Log File", size: "2.4 MB", date: "2024-03-10" },
      { name: "ip_track.json", type: "Network Trace", size: "15 KB", date: "2024-03-10" }
    ],
    timeline: [
      { event: "Case created", timestamp: "2024-03-10 09:00", user: "System" },
      { event: "Assigned to Sajith", timestamp: "2024-03-10 09:15", user: "Admin" },
      { event: "Analysis started", timestamp: "2024-03-10 10:30", user: "Sajith" }
    ]
  },
  {
    id: "CASE-002",
    serverId: "SRV-883",
    status: "Pending",
    priority: "Critical",
    deadline: "2024-03-15",
    assignedAnalyst: "Jamie Smith",
    caseType: "Malware Outbreak",
    description: "Ransomware-like activity detected on file server. Encrypted file extensions found in /home/shared.",
    user: {
      name: "Mark Johnson",
      email: "m.johnson@defense.gov",
      role: "System Admin",
      id: "USER-112"
    },
    evidence: [
      { name: "malware_sample.exe", type: "Binary", size: "450 KB", date: "2024-03-11" },
      { name: "encrypted_files_list.txt", type: "Text", size: "12 KB", date: "2024-03-11" }
    ],
    timeline: [
      { event: "Case created", timestamp: "2024-03-11 14:20", user: "System" }
    ]
  },
  {
    id: "CASE-003",
    serverId: "SRV-102",
    status: "Solved",
    priority: "Low",
    deadline: "2024-03-05",
    assignedAnalyst: "Sarah Miller",
    caseType: "Phishing",
    description: "User reported suspicious email claiming to be from HR requesting login credentials.",
    user: {
      name: "David Lee",
      email: "d.lee@defense.gov",
      role: "General Staff",
      id: "USER-305"
    },
    evidence: [
      { name: "phishing_email.eml", type: "Email", size: "45 KB", date: "2024-03-01" }
    ],
    timeline: [
      { event: "Case created", timestamp: "2024-03-01 10:00", user: "System" },
      { event: "Analyzed link", timestamp: "2024-03-01 11:00", user: "Sarah Miller" },
      { event: "Blocked domain", timestamp: "2024-03-02 09:30", user: "Sarah Miller" },
      { event: "Marked as Solved", timestamp: "2024-03-02 16:00", user: "Sarah Miller" }
    ]
  },
  {
    id: "CASE-004",
    serverId: "SRV-441",
    status: "In Progress",
    priority: "Medium",
    deadline: "2024-03-25",
    assignedAnalyst: "Sajith",
    caseType: "Data Leakage",
    description: "Potential data exfiltration detected in outbound DNS traffic. High volume of TXT queries.",
    user: {
      name: "Emily Davis",
      email: "e.davis@defense.gov",
      role: "Network Engineer",
      id: "USER-991"
    },
    evidence: [
      { name: "pcap_dump.pcap", type: "Network Capture", size: "150 MB", date: "2024-03-12" }
    ],
    timeline: [
      { event: "Case created", timestamp: "2024-03-12 08:45", user: "System" },
      { event: "Assigned to Sajith", timestamp: "2024-03-12 09:00", user: "Admin" }
    ]
  }
];

export const mockPlaybooks: Playbook[] = [
  {
    id: "PB-001",
    caseId: "CASE-001",
    summary: "Investigation steps for unauthorized database access attempts.",
    status: "Approved",
    steps: [
      { id: "S1", title: "Review auth logs", description: "Filter for failed login attempts and source IPs." },
      { id: "S2", title: "Check user permissions", description: "Verify if Sarah Williams has access to SRV-992." },
      { id: "S3", title: "Scan for vulnerabilities", description: "Run Nessus scan on SRV-992 database port." }
    ],
    commands: [
      { id: "C1", command: "last -f /var/log/auth.log | grep fail", description: "List failed logins" },
      { id: "C2", command: "netstat -tulnp | grep :3306", description: "Check DB port listeners" }
    ]
  },
  {
    id: "PB-002",
    caseId: "CASE-002",
    summary: "Ransomware mitigation and recovery procedure.",
    status: "Draft",
    steps: [
      { id: "S1", title: "Isolate server", description: "Disconnect SRV-883 from the network immediately." },
      { id: "S2", title: "Identify strain", description: "Upload sample to VirusTotal for identification." },
      { id: "S3", title: "Restore from backup", description: "Locate most recent clean backup from 48h ago." }
    ],
    commands: [
      { id: "C1", command: "iptables -A INPUT -j DROP", description: "Block all incoming traffic" },
      { id: "C2", command: "sha256sum malware_sample.exe", description: "Generate file hash" }
    ]
  }
];

export const mockReports: Report[] = [
  {
    id: "REP-001",
    caseId: "CASE-003",
    userDetails: "David Lee (USER-305)",
    status: "Final",
    sentToUser: true,
    resolution: "The reported email was identified as a spear-phishing attempt. The malicious domain has been blocked company-wide and no evidence of credential compromise was found.",
    aiSuggestedResolution: "Identify phishing domain and block at gateway. Reset user passwords if necessary.",
    date: "2024-03-02"
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    title: "High Disk Usage",
    message: "Server SRV-992 is at 92% disk capacity.",
    severity: "Warning",
    timestamp: "2024-03-12 10:15",
    read: false
  },
  {
    id: "ALT-002",
    title: "Brute Force Attempt",
    message: "15 failed SSH attempts detected on SRV-102 in 2 minutes.",
    severity: "Critical",
    timestamp: "2024-03-12 11:30",
    read: false
  },
  {
    id: "ALT-003",
    title: "System Update",
    message: "Kernel update scheduled for tonight at 23:00.",
    severity: "Info",
    timestamp: "2024-03-12 09:00",
    read: true
  }
];

export const mockMessages: Message[] = [
  {
    id: "MSG-001",
    sender: "Sajith",
    recipient: "Sarah Williams",
    content: "Hi Sarah, I'm looking into the unauthorized access report. Can you confirm if you were trying to log in at 02:00 UTC?",
    timestamp: "2024-03-10 11:00",
    type: "sent"
  },
  {
    id: "MSG-002",
    sender: "Sarah Williams",
    recipient: "Sajith",
    content: "No, I was asleep at that time. That definitely wasn't me.",
    timestamp: "2024-03-10 11:45",
    type: "received"
  }
];

export const mockStats = {
  total: mockCases.length,
  pending: mockCases.filter(c => c.status === 'Pending').length,
  solved: mockCases.filter(c => c.status === 'Solved').length,
  inProgress: mockCases.filter(c => c.status === 'In Progress').length,
};

export const statusChartData = [
  { name: 'Pending', value: mockStats.pending, color: 'hsl(var(--warning))' },
  { name: 'In Progress', value: mockStats.inProgress, color: 'hsl(var(--accent))' },
  { name: 'Solved', value: mockStats.solved, color: 'hsl(var(--success))' },
];

export const typeChartData = [
  { name: 'Phishing', total: 12 },
  { name: 'Malware', total: 8 },
  { name: 'Access', total: 5 },
  { name: 'Leak', total: 3 },
  { name: 'DDoS', total: 2 },
];
