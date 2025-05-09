
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  ClipboardList, 
  Database, 
  Edit,
  FileText,
  Info,
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
  Brain
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
  fileText: FileText,
  home: Home,
  info: Info, // Add the info icon
  loader: Loader2,
  login: LogIn,
  logout: LogOut,
  medicalRecords: ClipboardList, // Using ClipboardList as a substitute for MedicalRecords
  menu: Menu,
  moon: Moon,
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
