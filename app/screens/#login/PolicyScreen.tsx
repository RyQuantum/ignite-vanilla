import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { Text, Screen } from "../../components"
import { spacing } from "../../theme"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

export const PolicyScreen: FC<any> = observer(function PolicyScreen(_props) {
  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text preset="subheading">Data Privacy and Security Policy</Text>
      <DemoDivider />
      <DemoDivider />
      <Text size="xs">
        Sifely operates a platform that manage all locks which integrate Sifely PCBs.
      </Text>
      <DemoDivider />
      <Text size="xs">
        This Privacy Policy sets out how Sifely collects, uses or discloses personal data that you have provided to us through the Platform or Services.
      </Text>
      <Text size="xs">
        By using the Platform or Services, you consent to the collection, use and disclosure of your personal data as set out in this Privacy Policy.
        If you do not agree with this Privacy Policy, then we cannot provide the Platform or Services to you, and you should stop accessing the Platform. This Privacy Policy does not apply to other websites to which we link ("Third Party Website" or "Third Party Websites").
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">DEFINITIONS</Text>
      <DemoDivider />
      <Text size="xs">
        "Aggregated Information" means information about all of our users or specific groups or categories of users that we combine together so that it can no longer identify or reference an individual user.
      </Text>
      <DemoDivider />
      <Text size="xs">
        "Data Controller" means the company responsible for the use and processing of Personal Information.
      </Text>
      <DemoDivider />
      <Text size="xs">
        "Personal Data" means information relating to a living individual who is or can be identified either from that information or from that information in conjunction with other information that is in, or is likely to come into, the possession of the Data Controller.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        WHAT TYPES OF INFORMATION DOES SIFELY GATHER ABOUT ITS USERS?
      </Text>
      <DemoDivider />
      <Text preset="bold">
        1. Information that you give us
      </Text>
      <DemoDivider />
      <Text size="xs">
        We collect and use the following personal data that you make available to us when accessing or using our Platform and Services. This personal data includes:
      </Text>
      <DemoDivider />
      <Text size="xs">
        (1) Your personal details, including your name, phone number and email address, such as when you register or update the details of your user account, or when you supply ID verification information;
      </Text>
      <DemoDivider />
      <Text size="xs">
        (2) Service, billing and delivery address, such as when you order or control home automation devices such as smart locks, thermostats, cameras amongst others, or grant control to the platform to apply intelligent algorithms to assist in controlling these devices;
      </Text>
      <DemoDivider />
      <Text size="xs">
        (3) Contact list. You can select a phone number from your contact list and send an ekey to him;
      </Text>
      <DemoDivider />
      <Text size="xs">
        (4) Personal data that you have provided to Third Party Websites or services (e.g. Facebook or Airbnb, iCal or gmail calendar) and connected or synced to your Sifely account to the extent that you have authorised and consented to such disclosure by the Third Party Websites or services; and
      </Text>
      <DemoDivider />
      <Text size="xs">
        (5) Any information you may have provided.
      </Text>
      <DemoDivider />
      <Text preset="bold">
        2. Mobile Data
      </Text>
      <DemoDivider />
      <Text size="xs">
        When you use certain features of the Platform, in particular our mobile applications we may collect and use different types of personal data such as your location, including general information (e.g., IP address, zip code) and more specific information (e.g., GPS-based functionality on mobile devices used to access the Platform or specific features of the platform). If you access the Platform through a mobile device and you do not want your device to provide us with location-tracking information, you can disable the GPS or other location-tracking functions on your device, provided your device allows you to do this. See your device manufacturer's instructions for further details.
      </Text>
      <DemoDivider />
      <Text preset="bold">
        3. Log Data
      </Text>
      <DemoDivider />
      <Text size="xs">
        We may also collect and use Log Data, which is information that is automatically recorded by our servers whenever you access or use the Platform, regardless of whether you are registered with Sifely or logged in to your Sifely account, such as your IP Address, the date and time you access or use the Platform, the hardware and software you are using, referring and exit pages and URLs, the number of clicks, pages viewed and the order of those pages, and the amount of time spent on particular pages.
      </Text>
      <DemoDivider />
      <Text preset="bold">
        4. Cookies and other Tracking Technologies
      </Text>
      <DemoDivider />
      <Text size="xs">
        Sifely uses cookies and other similar technologies, such as mobile application identifiers, on the Platform. As a result, when you access or use the Platform, you consent to the use of such technologies and providing or making available certain information to us and to our business partners as set out below.
      </Text>
      <DemoDivider />
      <Text size="xs">
        While you may disable the usage of cookies through your browser settings, we do not change our practices in response to a "Do Not Track" signal in the HTTP header from your browser or mobile application.
      </Text>
      <Text size="xs">
        We make use of cookies and other similar technologies to track your activities if you click on advertisements for Sifely services on third party platforms such as search engines and social networks, and may use analytics to track what you do in response to those advertisements.
      </Text>
      <Text size="xs">
        We may, either directly or through third party companies and individuals we engage to provide services to us, also continue to track your behavior on our own Platform for purposes of our own customer support, analytics, research, product development, fraud prevention, risk assessment, regulatory compliance, investigation, as well as to enable you to use and access the Platform and pay for your activities on the Platform.
      </Text>
      <Text size="xs">
        We may also, either directly or through third party companies and individuals we engage to provide services to us, track your behavior on our own Platform to market and advertise our services to you on the Platform and third party websites.
      </Text>
      <Text size="xs">
        Third parties delivering advertisements or services on our Platform may have their own privacy policies and may set their own or other third party cookies via these advertisements and services. Other than setting up the coding they request when we receive the advert we don’t have control over how these companies employ cookies. While third parties may not collect information about users’ online activities on the Platform except as described in this policy and our Cookie Policy, by permitting cookies to be used while visiting our sites, you are agreeing to the use of cookies described in this section.
      </Text>
      <DemoDivider />
      <Text size="xs">
        Please note that if you have disabled cookies completely, you may not be able to access any or all of the features on the Platform, you may also still receive advertising on or about the Platform – it just will not be tailored to your interests.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        HOW SIFELY USES AND PROCESSES THE INFORMATION THAT YOU PROVIDE OR MAKE AVAILABLE
      </Text>
      <DemoDivider />
      <Text size="xs">
        We collect and use personal data for the following purposes:
      </Text>
      <Text size="xs">
        1. to enable you to access and use the Platform;
      </Text>
      <Text size="xs">
        2. to operate, protect, improve and optimize the Platform, Sifely's business, and our users' experience, such as to perform analytics, conduct research, personalize or otherwise customize your experience, and where you have given your consent for advertising and marketing;
      </Text>
      <Text size="xs">
        3. to help create and maintain a trusted and safer environment on the Platform and Services, such as through fraud detection and prevention, conducting investigations and risk assessments;
      </Text>
      <Text size="xs">
        4. to send you service, support and administrative messages, reminders, technical notices, updates, security alerts, and information requested by you;
      </Text>
      <Text size="xs">
        5. where we have your consent, to send you marketing and promotional messages and other information that may be of interest to you, including information about Sifely or general promotions for partner campaigns and services. You can unsubscribe or opt-out from receiving these communications by contacting us at cs@sifely.com;
      </Text>
      <Text size="xs">
        6. to administer referral programs, rewards, surveys, sweepstakes, contests, or other promotional activities or events sponsored or managed by Sifely or our business partners; and
      </Text>
      <Text size="xs">
        7. to comply with our legal obligations, resolve any disputes that we may have with any of our users, and enforce our agreements with third parties.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        WHEN SIFELY DISCLOSES OR SHARES PERSONAL INFORMATION, AND TO WHOM
      </Text>
      <DemoDivider />
      <Text size="xs">
        IMPORTANT: When you use the Platform, your data may be sent to the United States and possibly other countries
      </Text>
      <Text size="xs">
        We may transfer, store, use and process your information, including any Personal Data, overseas such as to the United States. Please note that laws vary from jurisdiction to jurisdiction, and so the privacy laws applicable to the places where your information is transferred to or stored, used or processed in, may be different from the privacy laws applicable to the place where you are resident.
      </Text>
      <DemoDivider />
      <Text size="xs">
        Your Personal Data may be disclosed as follows:
      </Text>
      <DemoDivider />
      <Text size="xs">
        1. Parts of your public profile page that contain some Personal Data may be displayed in other parts of the Platform to other users for marketing purposes or to the extent necessary to operate and manage referral and rewards programs.
      </Text>
      <DemoDivider />
      <Text size="xs">
        2. As necessary to enable guests that you have approved to access the services you have subscribed to or the home automation devices available in your home. For example, an SMS or Email will be sent to your guest with the approved listing information to inform the guest on the check-in procedure.
      </Text>
      <DemoDivider />
      <Text size="xs">
        3. As necessary to enable the linking of your account on a third party social networking site to your Sifely account.
      </Text>
      <DemoDivider />
      <Text size="xs">
        Do note that some features on the Platform may require the publication and display of information received from the third party social networking site, as well as the publication and display of information from the Platform to the third party social networking site. You will be able to control such disclosure through the settings and authorisation on the Platform and, to the extent possible, on the third party social networking site.
      </Text>
      <DemoDivider />
      <Text size="xs">
        4. We may distribute parts of the Platform for display on sites operated by Sifely business partners and affiliates, using technologies such as HTML widgets.
      </Text>
      <DemoDivider />
      <Text size="xs">
        5. We may allow our related entities such as our subsidiaries, and their employees, to use and process your Personal Information in the same way and to the same extent that we are permitted to under this Privacy Policy. These related entities comply with the same obligations that we have to protect your Personal Information under this Privacy Policy.
      </Text>
      <DemoDivider />
      <Text size="xs">
        6. We may also engage third party companies and individuals, to provide services to us, including but not limited to technology services and services to help verify your identity, to conduct checks against databases such as public government databases (where legally allowed), to otherwise assist us with fraud prevention and risk assessment, to assist us with customer service, and to facilitate the payments or reimbursements you request (such as Concur and American Express). We may provide Personal Information about you to these third parties, or give them access to this Personal Information, for the limited purpose of allowing them to provide these services. We will ensure that such third parties have contractual obligations to protect this Personal Information and to not use it for unrelated purposes.
      </Text>
      <DemoDivider />
      <Text size="xs">
        This Privacy Policy is subject to any existing laws of the Republic of Singapore in relation to the protection of information and if required by any lawful authority for any legal purposes such as the enforcement of any laws or to prevent the breaching of any laws, we shall release all such information as is legally required by the requisite and lawful authority in accordance with the directions of the lawful court of the competent jurisdiction.
      </Text>
      <Text size="xs">
        We may also publish, disclose and use Aggregated Information and non-personal information for industry and market analysis, demographic profiling, marketing and advertising, and other business purposes.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        HOW TO CHANGE OR DELETE YOUR INFORMATION, OR CANCEL YOUR SIFELY ACCOUNT
      </Text>
      <Text size="xs">
        You may review, update, correct or delete the Personal Information in your Sifely account. If you would like to correct your information or cancel your Sifely account entirely, you can do so by logging in to your account.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        SECURING YOUR PERSONAL INFORMATION
      </Text>
      <Text size="xs">
        We are continuously implementing and updating administrative, technical, and physical security measures to help protect your Personal Information against unauthorized access, destruction or alteration. However, no method of transmission over the Internet, and no method of storing electronic information, can be 100% secure. So, we cannot guarantee the absolute security of your transmissions to us and of your Personal Information that we store.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        YOUR PRIVACY WHEN YOU ACCESS THIRD-PARTY WEBSITES AND RESOURCES
      </Text>
      <DemoDivider />
      <Text size="xs">
        The Platform will contain links to other websites not owned or controlled by Sifely. Sifely does not have any control over third party websites. These other websites may place their own cookies, web beacons or other files on your device, or collect and solicit Personal Data from you. They will have their own rules about the collection, use and disclosure of Personal Data. We encourage you to read the terms of use and privacy policies of the other websites that you visit.
      </Text>
      <Text size="xs">
        Some portions of the Platform implement Google Maps/Earth mapping services, including Google Maps API(s). Your use of Google Maps/Earth is subject to Google's terms of use (located at http://www.google.com/intl/en_us/help/terms_maps.html) and Google's privacy policy (located at http://www.google.com/privacy.html), as may be amended by Google from time to time.
      </Text>
      <DemoDivider size={20} />
      <Text preset="subheading">
        CHANGES TO THIS PRIVACY POLICY
      </Text>
      <DemoDivider />
      <Text size="xs">
        We may change how we collect, use and disclose Personal Data at any time. We may change this Privacy Policy at any time. If we make material changes to the Privacy Policy, we will notify you by posting a notice on the Platform and by sending an email to you. If we let you know of changes through an email communication, then the date on which we send the email will be deemed to be the date of your receipt of that email.
      </Text>
      <Text size="xs">
        It's important that you review the changed Privacy Policy. If you do not wish to agree to the changed Privacy Policy, then we will not be able to continue providing the Platform and Services to you, and your only option will be to stop accessing the Platform and Services and deactivate your Sifely account. You can deactivate your account by sending us an email to cs@sifely.com.
      </Text>

    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}
