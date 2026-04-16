import { Link } from "@tanstack/react-router";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-white/[0.06]">
        <div className="max-w-[680px] mx-auto px-6 pt-12 pb-10">
          <Link
            to="/"
            className="inline-block text-[13px] text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-300 transition-colors mb-8"
          >
            &larr; Home
          </Link>
          <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.025em] text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-[14px] text-gray-400 dark:text-gray-600">
            Effective April 16, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[680px] mx-auto px-6 py-12 sm:py-16">
        <div className="space-y-10 text-[15px] sm:text-[16px] leading-[1.75] text-gray-600 dark:text-gray-400">
          <p>
            Deepen Labs Inc. ("
            <strong className="text-gray-900 dark:text-gray-200 font-medium">
              Deepen
            </strong>
            ," "we," "our," or "us") provides an AI-powered knowledge management
            platform through a web application and browser extension (the
            "Service"). This policy describes how we handle your information.
          </p>

          {/* ── Information We Collect ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Information We Collect
            </h2>

            <p className="font-medium text-gray-900 dark:text-gray-200 mb-1">
              Account information
            </p>
            <p>
              When you create an account we collect your name, email address,
              and authentication credentials. If you sign in through a
              third-party provider such as Google, we receive your name, email,
              and profile photo from that provider.
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-200 mt-6 mb-1">
              Captured content
            </p>
            <p className="mb-2">
              When you use the Deepen browser extension to capture a web page,
              we collect the page URL, title, description, author metadata, the
              main text content converted to Markdown, document headings and
              links, favicon, site name, language, and publication date when
              available.
            </p>
            <p>
              Content is captured{" "}
              <strong className="text-gray-900 dark:text-gray-200 font-medium">
                only when you click the capture button
              </strong>
              . The extension does not run in the background, does not monitor
              your browsing activity, and does not collect data from pages you
              have not chosen to capture.
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-200 mt-6 mb-1">
              Usage information
            </p>
            <p>
              We collect information about how you interact with the Service,
              including features used, captures created, and searches performed.
              We do not use third-party advertising trackers.
            </p>
          </div>

          {/* ── How We Use Your Information ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-300 dark:marker:text-gray-700">
              <li>
                <strong className="text-gray-900 dark:text-gray-200 font-medium">
                  Providing the Service
                </strong>{" "}
                — storing, organizing, and displaying your captured content.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-200 font-medium">
                  AI features
                </strong>{" "}
                — generating summaries, tags, semantic search embeddings, and
                powering Brain Chat.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-200 font-medium">
                  Authentication
                </strong>{" "}
                — verifying your identity and maintaining session security.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-200 font-medium">
                  Product improvement
                </strong>{" "}
                — analyzing aggregate usage patterns to improve reliability and
                develop new features.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-200 font-medium">
                  Communication
                </strong>{" "}
                — transactional emails related to your account and, with your
                consent, product updates.
              </li>
            </ul>
          </div>

          {/* ── Data Storage & Security ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Data Storage & Security
            </h2>
            <p>
              Your data is stored on secure, access-controlled servers. All data
              in transit is encrypted using TLS. We implement industry-standard
              practices including secure session management, access controls,
              and regular security reviews.
            </p>
            <p className="mt-4">
              Your captured content is private to your account. We do not sell,
              rent, or share your personal content with third parties for their
              marketing purposes.
            </p>
          </div>

          {/* ── AI Processing ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              AI Processing
            </h2>
            <p>
              To provide summarization, topic extraction, semantic search, and
              Brain Chat, your captured content is processed by third-party AI
              models through secure API calls. Content is sent to AI providers
              solely to generate outputs for your personal use within the
              Service. We do not permit these providers to use your content for
              model training, and our agreements prohibit data retention beyond
              what is necessary to fulfill the request.
            </p>
            <p className="mt-4">
              Vector embeddings of your content are stored in our database to
              power semantic search. These embeddings are numerical
              representations and cannot be reversed into the original text.
            </p>
          </div>

          {/* ── Browser Extension ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Browser Extension
            </h2>
            <p className="mb-4">
              The Deepen browser extension requests the following permissions:
            </p>
            <div className="rounded-lg border border-gray-100 dark:border-white/[0.06] overflow-hidden">
              <div className="flex border-b border-gray-100 dark:border-white/[0.06]">
                <div className="w-[120px] sm:w-[140px] flex-shrink-0 px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02] text-[13px] font-medium text-gray-900 dark:text-gray-300">
                  activeTab
                </div>
                <div className="px-4 py-3 text-[14px]">
                  Grants temporary access to the current tab only when you click
                  the extension icon. Cannot access other tabs or pages.
                </div>
              </div>
              <div className="flex">
                <div className="w-[120px] sm:w-[140px] flex-shrink-0 px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02] text-[13px] font-medium text-gray-900 dark:text-gray-300">
                  scripting
                </div>
                <div className="px-4 py-3 text-[14px]">
                  Extracts page content from the active tab when you initiate a
                  capture. No scripts run until you click capture.
                </div>
              </div>
            </div>
            <p className="mt-4">
              The extension communicates exclusively with the Deepen API. It
              does not contact third-party services, inject advertisements, or
              modify web page content.
            </p>
          </div>

          {/* ── Third-Party Services ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Third-Party Services
            </h2>
            <p>
              We use cloud hosting, database, and storage providers for
              infrastructure; AI providers for content analysis features; and
              authentication services for identity verification. All third-party
              providers are bound by data processing agreements that limit their
              use of your data to providing services on our behalf.
            </p>
          </div>

          {/* ── Data Retention ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. You may
              delete individual captures at any time. If you delete your
              account, all associated data is permanently removed within 30
              days, except where retention is required by law.
            </p>
          </div>

          {/* ── Your Rights ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Your Rights
            </h2>
            <p className="mb-2">Depending on your jurisdiction, you may:</p>
            <ul className="space-y-2 list-disc pl-5 marker:text-gray-300 dark:marker:text-gray-700">
              <li>Request a copy of the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your data and account</li>
              <li>Export your captured content in a portable format</li>
              <li>Object to certain processing of your data</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at the address below. We
              respond within 30 days.
            </p>
          </div>

          {/* ── Children's Privacy ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Children's Privacy
            </h2>
            <p>
              Deepen is not directed to individuals under the age of 16. We do
              not knowingly collect personal information from children. If we
              learn that we have collected data from a child without parental
              consent, we will delete it promptly.
            </p>
          </div>

          {/* ── Changes ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Material changes will
              be communicated by updating the effective date above and, where
              appropriate, through an in-app or email notification. Continued
              use of the Service after changes constitutes acceptance.
            </p>
          </div>

          {/* ── Contact ── */}
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.01em] mb-4">
              Contact
            </h2>
            <p>
              Questions about this policy or your data rights? Reach us at{" "}
              <a
                href="mailto:support@linkmeld.com"
                className="text-gray-900 dark:text-gray-200 underline underline-offset-[3px] decoration-gray-300 dark:decoration-gray-700 hover:decoration-gray-900 dark:hover:decoration-gray-400 transition-colors"
              >
                support@deepen.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
