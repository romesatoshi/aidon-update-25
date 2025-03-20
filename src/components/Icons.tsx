
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  ClipboardList, 
  Database, 
  Edit,
  FileText,
  Loader2, 
  LogOut, 
  Menu,
  Moon, 
  Plus, 
  QrCode, 
  RotateCcw,
  Sun, 
  Trash, 
  User, 
  X,
  AlertTriangle,
  Mic,
  Check,
  Clipboard,
  LogIn,
  Home,
  Download,
  Upload,
  RefreshCcw,
  Brain,
  Play,
  FileIcon,
  History
} from "lucide-react";

// Create custom icons or rename existing ones here
const Icons = {
  arrowLeft: ArrowLeft,
  back: ArrowLeft,
  brain: Brain,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  clipboard: Clipboard,
  clipboardList: ClipboardList,
  close: X,
  database: Database, 
  download: Download,
  edit: Edit,
  emergency: AlertTriangle, // Using AlertTriangle as a substitute for Emergency
  file: FileIcon, // Added missing file icon
  fileText: FileText,
  history: History, // Added missing history icon
  home: Home,
  loader: Loader2,
  login: LogIn,
  logout: LogOut,
  medicalRecords: ClipboardList, // Using ClipboardList as a substitute for MedicalRecords
  menu: Menu,
  moon: Moon,
  play: Play, // Added missing play icon
  plus: Plus,
  qrCode: QrCode,
  refresh: RefreshCcw,
  reset: RotateCcw, // Using RotateCcw as a substitute for Reset
  spinner: Loader2, // Using Loader2 as a substitute for Spinner
  sun: Sun,
  trash: Trash,
  upload: Upload,
  user: User,
  voice: Mic, // Using Mic as a substitute for Voice
};

export default Icons;
