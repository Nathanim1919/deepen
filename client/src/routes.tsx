// src/router.tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MainShell } from "./layout/MainShell";
import { ContentLayout } from "./layout/ContentLayout";
import { UserProfile } from "./pages/UserProfile";
import EmptyNoteView from "./components/EmptyNoteView";
import BookmarkPanel from "./components/panels/BookmarkPanel";
import SourcePanel from "./components/panels/SourcePanel";
import FoldersPanel from "./components/panels/FoldersPanel";
import { PublicLayout } from "./layout/PublicLayout";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import HeroPage from "./pages/hero";
import { FAQ } from "./pages/FAQ";
// import { Manifesto } from "./pages/manifesto";
import { FolderLayout } from "./layout/FolderLayout";
import { SourceLayout } from "./layout/SourceLayout";
import { HomeLayout } from "./layout/HomeLayout";
import { CaptureDetail } from "./components/CaptureDetail";
import { BookMarkLayout } from "./layout/BookmarkLayout";
import FeedbackHub from "./pages/FeedbackHub";
import { FolderNotes } from "./components/FolderNotes";
import { SourceNotes } from "./components/SourceNotes";
import { Manifesto } from "./pages/manifesto";
import Waitlist from "./pages/Waitlist";
import ConversationList from "./components/panels/conversationList";
import { BrainChatContainer } from "./components/brainChat/BrainChatContainer";
import { EmptyChatView } from "./components/brainChat/EmptyChatView";
import { PricingPage } from "./pages/PricingPage";

const FolderPanel = () => <FoldersPanel />;


const FolderNoteDetail = () => {
  return <CaptureDetail />;
};

const SourceNoteDetail = () => {
  return <CaptureDetail />;
};

const SourcesPanel = () => {
  return <SourcePanel />;
};

const BookmarksPanel = () => {
  return <BookmarkPanel />;
};

const ConversationListPanel = () => {
  return <ConversationList />;
};

const ConversationDetail = () => {
  return <CaptureDetail />;
};

const BookmarkDetail = () => {
  return <CaptureDetail />;
};

// --- Routes --- //

const rootRoute = createRootRoute();

// Public routes (wrapped in PublicLayout)
const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public", // It's good practice to give layout routes a unique ID
  component: PublicLayout,
});

// Home route (renders HeroPage) - This is now the index route for publicRoute
const heroRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/",
  component: HeroPage,
});


const waitlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "waitlist",
  component: Waitlist, // Assuming this is the same as HeroPage for now
});

const ManifestoRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "manifesto",
  component: Manifesto,
});

const PricingRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "pricing",
  component: PricingPage,
});

const FAQRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "faqs",
  component: FAQ,
});

const FeedbackRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "feedback",
  component: FeedbackHub,
});


const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: RegisterPage,
});

const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: LoginPage,
});

// Authenticated routes (wrapped in MainShell)
const mainShellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "mainShell",
  component: MainShell,
});

const contentRoute = createRoute({
  getParentRoute: () => mainShellRoute,
  path: "/in",
  component: ContentLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: "/",
  component: EmptyNoteView, // This can be a layout if you want to nest more routes
});

const capturesPanel = createRoute({
  getParentRoute: () => contentRoute,
  path: "captures",
  component: HomeLayout,
});

const captureDetail = createRoute({
  getParentRoute: () => capturesPanel,
  path: "$captureId",
  component: CaptureDetail,
});

const folderLayoutRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: "collections",
  component: FolderLayout, // This can be a layout if you want to nest more routes
});

const foldersPanel = createRoute({
  getParentRoute: () => folderLayoutRoute,
  path: "/",
  component: FolderPanel,
});

const folderNotes = createRoute({
  getParentRoute: () => folderLayoutRoute,
  path: "$folderId",
  component: FolderNotes,
});

const folderNoteDetail = createRoute({
  getParentRoute: () => folderNotes, // This must match the $folderId route
  path: "captures/$captureId",
  component: FolderNoteDetail,
});

const sourceLayoutRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: "sources",
  component: SourceLayout, // This can be a layout if you want to nest more routes
});

const sourcesPanel = createRoute({
  getParentRoute: () => sourceLayoutRoute,
  path: "/",
  component: SourcesPanel,
});

const conversationListPanel = createRoute({
  getParentRoute: () => contentRoute,
  path: "brain",
  component: ConversationListPanel, // This can be a layout if you want to nest more routes
});

const brainChatContainer = createRoute({
  getParentRoute: () => conversationListPanel,
  path: "$conversationId",
  component: BrainChatContainer,
});

const emptyChatView = createRoute({
  getParentRoute: () => conversationListPanel,
  path: "/",
  component: EmptyChatView,
});

const conversationDetail = createRoute({
  getParentRoute: () => conversationListPanel,
  path: "captures/$captureId",
  component: ConversationDetail,
});

const sourceNotes = createRoute({
  getParentRoute: () => sourceLayoutRoute,
  path: "$sourceId",
  component: SourceNotes,
});

const sourceNoteDetail = createRoute({
  getParentRoute: () => sourceNotes,
  path: "captures/$captureId",
  component: SourceNoteDetail,
});

const BookmarkLayout = createRoute({
  getParentRoute: () => contentRoute,
  path: "bookmarks",
  component: BookMarkLayout, // This can be a layout if you want to nest more routes
});

const bookmarksPanel = createRoute({
  getParentRoute: () => BookmarkLayout,
  path: "/",
  component: BookmarksPanel,
});

const bookmarkDetail = createRoute({
  getParentRoute: () => bookmarksPanel,
  path: "captures/$captureId",
  component: BookmarkDetail,
});

const profileRoute = createRoute({
  getParentRoute: () => mainShellRoute,
  path: "/profile",
  component: UserProfile,
});

// --- Final Tree --- //
export const routeTree = rootRoute.addChildren([
  waitlistRoute,
  publicRoute.addChildren([
    heroRoute,
    PricingRoute,
    ManifestoRoute,
    // FeaturesRoute,
    FAQRoute,
    FeedbackRoute,
  ]), // Correctly nest children of PublicLayout
  RegisterRoute,
  LoginRoute,
  mainShellRoute.addChildren([
    contentRoute.addChildren([
      homeRoute,
      capturesPanel.addChildren([captureDetail]),
      folderLayoutRoute.addChildren([
        foldersPanel,
        folderNotes.addChildren([folderNoteDetail]),
      ]),
      sourceLayoutRoute.addChildren([
        sourcesPanel,
        sourceNotes.addChildren([sourceNoteDetail]),
      ]),
      BookmarkLayout.addChildren([bookmarksPanel, bookmarkDetail]),
      conversationListPanel.addChildren([conversationDetail, brainChatContainer, emptyChatView]),
    ]),
    profileRoute,
  ]),
]);

export const router = createRouter({ routeTree });
