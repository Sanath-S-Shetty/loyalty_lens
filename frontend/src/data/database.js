export const mockBrands = {
  starbucks: {
    key: "starbucks",
    name: "Starbucks Rewards",
    score: 89,
    marketPosition: "Leader",
    sentiment: 78,
    confidence: 97,
    tiers: [
      { name: "Green Tier", requirement: "0-150 Stars", benefit: "Basic Rewards Access, Free Refills on brewed coffee/tea, Birthday Reward, Mobile Order & Pay" },
      { name: "Gold Tier", requirement: "150+ Stars", benefit: "Priority Benefits, Double-Star Days, Personalized offers, Custom Gold Card (digital)" }
    ],
    earnRate: "2 Stars per $1 spent with Starbucks Card, 1 Star per $1 with registered cash/debit/credit card",
    redemption: "25 Stars (customize drink), 100 Stars (brew/bakery), 200 Stars (handcrafted drink/hot breakfast), 400 Stars (merchandise)",
    strengths: "Seamless mobile app integration, highly gamified member experience, massive active global membership base, and low barrier to entry for casual consumers.",
    weaknesses: "Frequent redemption cost increases (points inflation), limited reward variety outside of beverages, and dependency on prepaying cards for max value.",
    positiveThemes: [
      { text: "Free Rewards", value: 88 },
      { text: "Easy Redemption", value: 84 },
      { text: "Mobile Experience", value: 92 },
      { text: "Birthday Benefits", value: 80 }
    ],
    negativeThemes: [
      { text: "Reward Expiration", value: 65 },
      { text: "Tier Complexity", value: 40 },
      { text: "Pricing Concerns", value: 72 },
      { text: "Limited Availability", value: 35 }
    ],
    sources: [
      { title: "Official Starbucks Rewards Terms & Conditions", url: "https://www.starbucks.com/rewards/terms", credibility: 99, trackedSince: "Jan 2024" },
      { title: "Consumer Reports: Loyalty Programs Comparison", url: "https://www.consumerreports.org/loyalty-cards", credibility: 95, trackedSince: "Mar 2025" },
      { title: "Reddit r/Starbucks - Points Value Discussion", url: "https://www.reddit.com/r/starbucks", credibility: 78, trackedSince: "Jun 2026" },
      { title: "JD Power Retail Loyalty Study", url: "https://www.jdpower.com/business/retail", credibility: 92, trackedSince: "Dec 2025" }
    ],
    sentinel: {
      lastCheck: "12 minutes ago",
      status: "active",
      credibilityScore: 97,
      updatesTracked: 142,
      alerts: [
        { type: "info", date: "Today, 10:45 AM", message: "T&C terms check completed. No text modifications detected." },
        { type: "warning", date: "June 05, 2026", message: "Points devaluation warning detected on premium merchandise redemptions (400 to 450 Stars)." },
        { type: "success", date: "May 28, 2026", message: "New mobile benefit verification: Double-Star Day promotion validated successfully." }
      ],
      scrapes: [
        { time: "23:12:05", status: "200 OK", size: "142 KB", source: "starbucks.com/rewards" },
        { time: "22:12:01", status: "200 OK", size: "38 KB", source: "reddit.com/r/starbucks" },
        { time: "20:12:00", status: "200 OK", size: "85 KB", source: "consumerreports.org" }
      ]
    },
    summary: {
      executiveSummary: "Starbucks Rewards remains one of the strongest retail loyalty programs in the market. The ecosystem excels due to high mobile adoption, a deeply gamified loyalty structure, and a friction-free ordering experience. However, recent adjustments to star valuations (points inflation) have sparked minor negative sentiment regarding value longevity.",
      keyFindings: [
        "Strong reward redemption flexibility with multiple tiers starting as low as 25 Stars.",
        "High customer engagement levels driven by interactive mobile app challenges.",
        "Competitive differentiation through mobile-first features such as order ahead and parking space pickup.",
        "Overall positive sentiment significantly exceeds industry retail averages despite point devaluation."
      ],
      metadata: {
        generated: "Today",
        confidence: "97%",
        sources: 48,
        verification: "Complete"
      }
    }
  },
  marriott: {
    key: "marriott",
    name: "Marriott Bonvoy",
    score: 85,
    marketPosition: "Leader",
    sentiment: 74,
    confidence: 94,
    tiers: [
      { name: "Silver Elite", requirement: "10 nights/year", benefit: "10% bonus points, Late checkout (subject to availability), Free Wi-Fi" },
      { name: "Gold Elite", requirement: "25 nights/year", benefit: "25% bonus points, 2 PM checkout, Room upgrades, Welcome gift (points)" },
      { name: "Platinum Elite", requirement: "50 nights/year", benefit: "50% bonus points, 4 PM checkout, Lounge access, Room upgrades to suites, Free breakfast" },
      { name: "Titanium Elite", requirement: "75 nights/year", benefit: "75% bonus points, 4 PM guaranteed checkout, Suite upgrades, Annual choice benefit" }
    ],
    earnRate: "10 points per $1 spent at Marriott hotels/resorts; up to 75% bonus based on Elite status",
    redemption: "Free nights starting at 5,000 points, points-to-airline transfers with 40+ airline partners (3:1 ratio)",
    strengths: "Massive global footprint of hotel brands, highly valuable top-tier benefits (guaranteed lounge/breakfast), and excellent points-to-miles transfer partner ratios.",
    weaknesses: "Transition to fully dynamic redemption pricing makes planning luxury redemptions harder, and mid-tier status (Gold/Silver) has relatively weak benefits.",
    positiveThemes: [
      { text: "Hotel Footprint", value: 94 },
      { text: "Lounge Access", value: 85 },
      { text: "Platinum Perks", value: 90 },
      { text: "Transfer Partners", value: 76 }
    ],
    negativeThemes: [
      { text: "Dynamic Pricing", value: 80 },
      { text: "Gold Tier Value", value: 58 },
      { text: "Point Devaluation", value: 70 },
      { text: "Availability Blocks", value: 45 }
    ],
    sources: [
      { title: "Marriott Bonvoy Program Rules & Terms", url: "https://www.marriott.com/loyalty/terms", credibility: 99, trackedSince: "Feb 2024" },
      { title: "The Points Guy: Marriott Bonvoy Review", url: "https://thepointsguy.com/guide/marriott-bonvoy", credibility: 91, trackedSince: "Jul 2025" },
      { title: "FlyerTalk Marriott Bonvoy Forum", url: "https://www.flyertalk.com/forum/marriott", credibility: 82, trackedSince: "May 2026" }
    ],
    sentinel: {
      lastCheck: "24 minutes ago",
      status: "active",
      credibilityScore: 94,
      updatesTracked: 89,
      alerts: [
        { type: "info", date: "Today, 10:33 AM", message: "Periodic rates check completed. Database synchronized." },
        { type: "warning", date: "June 01, 2026", message: "Dynamic award peak price spikes observed on European luxury resorts for late summer stays." }
      ],
      scrapes: [
        { time: "23:00:10", status: "200 OK", size: "320 KB", source: "marriott.com/loyalty" },
        { time: "21:30:15", status: "200 OK", size: "94 KB", source: "flyertalk.com" }
      ]
    },
    summary: {
      executiveSummary: "Marriott Bonvoy is a premier hospitality loyalty program that offers exceptional rewards for high-frequency business travelers. While the introduction of dynamic point redemption pricing has made points less predictable in value, its enormous global brand footprint and elite room upgrade benefits keep user retention high.",
      keyFindings: [
        "Unbeatable hotel portfolio and footprint spanning over 8,000 properties worldwide.",
        "Guaranteed free breakfast and lounge access for Platinum and higher tiers remains a major selling point.",
        "Dynamic award pricing has significantly increased points required for high-season bookings.",
        "Valuable airline transfer capability makes it highly versatile for travel maximizers."
      ],
      metadata: {
        generated: "Today",
        confidence: "94%",
        sources: 35,
        verification: "Complete"
      }
    }
  },
  delta: {
    key: "delta",
    name: "Delta SkyMiles",
    score: 80,
    marketPosition: "Challenger",
    sentiment: 64,
    confidence: 96,
    tiers: [
      { name: "Silver Medallion", requirement: "$5,000 MQD", benefit: "Complimentary upgrades, 7 miles/$1, Free checked bag, Priority check-in" },
      { name: "Gold Medallion", requirement: "$10,000 MQD", benefit: "Upgrades at 72 hrs, 8 miles/$1, Lounge access on Intl flights, Priority baggage" },
      { name: "Platinum Medallion", requirement: "$15,000 MQD", benefit: "Upgrades at 120 hrs, 9 miles/$1, Choice Benefit, Award fee waivers" },
      { name: "Diamond Medallion", requirement: "$28,000 MQD", benefit: "First class upgrades, 11 miles/$1, Delta Sky Club membership, Choice Benefits" }
    ],
    earnRate: "5 miles per $1 spent on ticket price (up to 11 miles/$1 for Diamond Elites); extra via Amex credit cards",
    redemption: "Award flights, class upgrades, Sky Club access, Delta Vacations packages, drinks in Sky Club",
    strengths: "Miles never expire, top-tier operational reliability, premium onboard product, and extensive global SkyTeam network.",
    weaknesses: "Drastic increases in Medallion Qualification Dollars (MQD) requirements; lowest value-per-mile among major US airlines (frequently nicknamed SkyPesos).",
    positiveThemes: [
      { text: "Operational Safety", value: 96 },
      { text: "Miles Never Expire", value: 98 },
      { text: "Boarding Priority", value: 82 },
      { text: "Premium Service", value: 89 }
    ],
    negativeThemes: [
      { text: "High MQD Hurdles", value: 92 },
      { text: "Low Mile Value", value: 88 },
      { text: "Club Access Restrictions", value: 75 },
      { text: "Partner Awards Price", value: 65 }
    ],
    sources: [
      { title: "Delta SkyMiles Program Rules & Guidelines", url: "https://www.delta.com/skymiles/program-rules", credibility: 99, trackedSince: "Mar 2024" },
      { title: "One Mile at a Time: Delta SkyMiles Analysis", url: "https://onemileatatime.com/guides/delta-skymiles", credibility: 94, trackedSince: "Sep 2025" },
      { title: "Frequent Miler: MQD Calculations", url: "https://frequentmiler.com/delta-mqd", credibility: 88, trackedSince: "Apr 2026" }
    ],
    sentinel: {
      lastCheck: "18 minutes ago",
      status: "active",
      credibilityScore: 96,
      updatesTracked: 74,
      alerts: [
        { type: "info", date: "Today, 09:15 AM", message: "Fare class earning table validated against global ticketing system." },
        { type: "error", date: "June 03, 2026", message: "Detected restriction update in Sky Club lounge access policies for basic cardholders." }
      ],
      scrapes: [
        { time: "23:05:00", status: "200 OK", size: "210 KB", source: "delta.com/skymiles" },
        { time: "21:00:22", status: "200 OK", size: "62 KB", source: "onemileatatime.com" }
      ]
    },
    summary: {
      executiveSummary: "Delta SkyMiles is built for flyer retention, delivering premium service and high operational reliability. However, recent dramatic increases to elite status qualification tiers (moving entirely to a dollar-spent model) and the continuous devaluation of miles have frustrated frequent flyers.",
      keyFindings: [
        "A true cash-to-status model (MQDs) rewards high-spending business class flyers over mileage accumulators.",
        "Miles do not expire, providing high utility for infrequent flyers who accumulate points slowly.",
        "High partner redemption costs make redeeming SkyMiles on international partners like Virgin Atlantic less attractive.",
        "Sky Club access has been throttled to prevent crowding, leading to split customer feedback."
      ],
      metadata: {
        generated: "Today",
        confidence: "96%",
        sources: 42,
        verification: "Complete"
      }
    }
  },
  sephora: {
    key: "sephora",
    name: "Sephora Beauty Insider",
    score: 82,
    marketPosition: "Leader",
    sentiment: 82,
    confidence: 95,
    tiers: [
      { name: "Insider", requirement: "Free to join", benefit: "1 point/$1, Birthday gift, free standard shipping on all orders, seasonal promotions" },
      { name: "VIB (Very Important Beauty)", requirement: "Spend $350/year", benefit: "1.25 points/$1, Better birthday options, early access to seasonal sales" },
      { name: "Rouge", requirement: "Spend $1,000/year", benefit: "1.5 points/$1, First access to products, Rouge Celebration Gift, free custom makeovers" }
    ],
    earnRate: "1 point per $1 spent; points multipliers (2x, 3x, 4x) during special seasonal events",
    redemption: "100 points (trial size samples), 500 points ($10 off Insider Cash), 2,500+ points (limited edition full-size items or charity donations)",
    strengths: "Extremely popular experiential rewards (Beauty Insider Bazaar), customizable birthday samples, and high point multiplier events.",
    weaknesses: "Top-tier Rouge benefits have been progressively watered down (e.g., removal of custom gifts, smaller sample sizes) and high points redemptions sell out instantly.",
    positiveThemes: [
      { text: "Birthday Gifts", value: 92 },
      { text: "Bazaar Samples", value: 86 },
      { text: "Multiplier Sales", value: 89 },
      { text: "Free Shipping", value: 94 }
    ],
    negativeThemes: [
      { text: "Rouge Perks Devalued", value: 75 },
      { text: "Fast Bazaar Sellouts", value: 88 },
      { text: "Low $ Value per Point", value: 64 },
      { text: "Points Expiry", value: 50 }
    ],
    sources: [
      { title: "Sephora Beauty Insider Terms & Conditions", url: "https://www.sephora.com/beauty/beauty-insider", credibility: 99, trackedSince: "Mar 2024" },
      { title: "Beauty Insider Reddit Discussion Panel", url: "https://www.reddit.com/r/Sephora", credibility: 80, trackedSince: "Jan 2026" },
      { title: "Retail Touchpoints Loyalty Case Study", url: "https://www.retailtouchpoints.com/topics/loyalty", credibility: 91, trackedSince: "Nov 2025" }
    ],
    sentinel: {
      lastCheck: "31 minutes ago",
      status: "active",
      credibilityScore: 95,
      updatesTracked: 112,
      alerts: [
        { type: "info", date: "Today, 09:30 AM", message: "Weekly Bazaar inventory check completed." },
        { type: "success", date: "June 08, 2026", message: "Point multiplier logic verified for upcoming Summer Savings Sale event." }
      ],
      scrapes: [
        { time: "22:54:12", status: "200 OK", size: "128 KB", source: "sephora.com/beauty" },
        { time: "20:43:00", status: "200 OK", size: "74 KB", source: "reddit.com/r/Sephora" }
      ]
    },
    summary: {
      executiveSummary: "Sephora's Beauty Insider program is a gold standard in retail loyalty marketing, focusing heavily on experiential value rather than pure discounts. However, maintaining the premium feel of the Rouge status is an ongoing challenge as users express frustration with points-based product drops selling out too quickly.",
      keyFindings: [
        "Experiential rewards like product masterclasses and trials drive high frequency visits.",
        "Point multiplier events are highly popular and trigger significant sales spikes.",
        "Rouge level members feel the $1,000 spending tier lacks high-end premium separation.",
        "The Bazaar's digital storefront requires fast checkout as rare samples expire or sell out in minutes."
      ],
      metadata: {
        generated: "Today",
        confidence: "95%",
        sources: 48,
        verification: "Complete"
      }
    }
  },
  hilton: {
    key: "hilton",
    name: "Hilton Honors",
    score: 82,
    marketPosition: "Challenger",
    sentiment: 71,
    confidence: 95,
    tiers: [
      { name: "Member", requirement: "Free to join", benefit: "Guaranteed lowest price, free Wi-Fi, digital key, no resort fees on award stays" },
      { name: "Silver", requirement: "4 stays or 10 nights", benefit: "20% bonus points, free bottled water, 5th night free on award stays" },
      { name: "Gold", requirement: "20 stays or 40 nights", benefit: "80% bonus points, space-available room upgrades, daily food & beverage credit (US) or free breakfast" },
      { name: "Diamond", requirement: "30 stays or 60 nights", benefit: "100% bonus points, executive lounge access, room upgrades to suites, premium Wi-Fi" }
    ],
    earnRate: "10 points per $1 spent at Hilton portfolio properties; up to 100% bonus for Diamond tier",
    redemption: "Free nights starting at 5,000 points, points pooling with friends/family, Points & Money checkout options",
    strengths: "Extremely easy-to-obtain mid-tier Gold status (which includes breakfast/credits), points pooling with up to 10 members, and fifth night free on awards.",
    weaknesses: "Large number of points required for luxury stays (due to dynamic pricing capping at 120,000+ points per night) and relatively low valuation per individual point (~0.5 cents).",
    positiveThemes: [
      { text: "Gold Tier Breakfast", value: 92 },
      { text: "Points Pooling", value: 88 },
      { text: "5th Night Free", value: 90 },
      { text: "Credit Card Status", value: 85 }
    ],
    negativeThemes: [
      { text: "Low Point Value", value: 82 },
      { text: "Dynamic Inflation", value: 74 },
      { text: "Executive Club Cuts", value: 60 },
      { text: "Daily Credit Caps", value: 68 }
    ],
    sources: [
      { title: "Hilton Honors Program Terms & Conditions", url: "https://www.hilton.com/en/hilton-honors/terms", credibility: 99, trackedSince: "Jan 2024" },
      { title: "PointMeNY: Hilton Honors Program Deep Dive", url: "https://pointmeny.com/guides/hilton-honors", credibility: 90, trackedSince: "Aug 2025" },
      { title: "Reddit r/Hilton - Daily Credit vs Breakfast", url: "https://www.reddit.com/r/hilton", credibility: 81, trackedSince: "May 2026" }
    ],
    sentinel: {
      lastCheck: "42 minutes ago",
      status: "active",
      credibilityScore: 95,
      updatesTracked: 96,
      alerts: [
        { type: "info", date: "Today, 08:30 AM", message: "Terms review: No updates detected." },
        { type: "warning", date: "June 06, 2026", message: "Points inflation detected on select Waldorf Astoria luxury properties." }
      ],
      scrapes: [
        { time: "22:42:00", status: "200 OK", size: "294 KB", source: "hilton.com/terms" },
        { time: "21:12:00", status: "200 OK", size: "88 KB", source: "reddit.com/r/hilton" }
      ]
    },
    summary: {
      executiveSummary: "Hilton Honors is widely appreciated for its generous mid-tier Gold status, which is easily obtainable via credit cards and offers daily dining credits. Points are easy to earn but carry a lower per-point cash equivalent, requiring strategic redemptions (such as the 5th-night-free offer) to maximize value.",
      keyFindings: [
        "Points pooling allows families to aggregate points easily to book award stays.",
        "Gold and Diamond statuses offer excellent food credits, though users note breakfast was preferred.",
        "Point values are low (~0.5c), but high earning rates from hotel spend and credit cards offset this.",
        "Award stays waive resort fees, adding significant savings on resort destinations."
      ],
      metadata: {
        generated: "Today",
        confidence: "95%",
        sources: 48,
        verification: "Complete"
      }
    }
  }
};
