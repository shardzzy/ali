<body>
  <button id="themeToggle" aria-label="Toggle theme">🌞</button>
  <div class="container">
    <div class="header">
      <img src="https://i.imgur.com/kgsfk22.png" alt="TikTok Icon">
      <h1>TikTok User Finder</h1>
    </div>
    <h2>Check out user stats and profile pics</h2>
    <p class="apology-message">If you face any problem, please contact us.</p>

    <div class="avatar-wrapper">
      <img id="avatar" src="" alt="User Avatar" loading="lazy">
    </div>

    <div id="downloadContainer" style="display: none;">
      <button id="downloadButton" aria-label="Download avatar">Download Avatar</button>
    </div>

    <div class="results-display" id="responseDisplay" aria-live="polite">Enter a username and click the button...</div>

    <div class="input-container">
      <input type="text" id="usernameInput" placeholder="Enter TikTok username" aria-label="TikTok username input">
      <button class="paste-button" aria-label="Paste username" onclick="pasteUsername()">
        <i class="fa-solid fa-paste"></i>
      </button>
      <button id="fetchButton" aria-label="Fetch user data">Fetch Data</button>
    </div>

    <div class="cooldown-timer" id="cooldownTimer" style="display: none;"></div>

    <div class="credits">
      Made with <span style="color: var(--ctp-red);">♥</span> by <a href="https://www.instagram.com/motherfuckergotfuckedup/" target="_blank">jamie</a> |
      Using <a href="https://github.com/catppuccin/catppuccin" target="_blank">Catppuccin</a> colors
      <button onclick="window.open('https://omar-thing.nekoweb.org/faq.html', '_blank')" class="faq-button">FAQ</button>
      <button onclick="window.open('https://tiktokfindercountry.xyz/', '_blank')" class="faq-button">Original Domain "kinda faster"</button>
      <script type="text/javascript" src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"></script>
      <script type="text/javascript">kofiwidget2.init('Support me on Ko-fi', '#cba6f7', 'Q5Q11B7WUD');kofiwidget2.draw();</script><style>img.kofiimg{display: initial!important;vertical-align:middle;height:13px!important;width:20px!important;padding-top:0!important;padding-bottom:0!important;border:none;margin-top:0;margin-right:5px!important;margin-left:0!important;margin-bottom:3px!important;content:url('https://storage.ko-fi.com/cdn/cup-border.png')}.kofiimg:after{vertical-align:middle;height:25px;padding-top:0;padding-bottom:0;border:none;margin-top:0;margin-right:6px;margin-left:0;margin-bottom:4px!important;content:url('https://storage.ko-fi.com/cdn/whitelogo.svg')}.btn-container{display:inline-block!important;white-space:nowrap;min-width:160px}span.kofitext{color:#fff !important;letter-spacing: -0.15px!important;text-wrap:none;vertical-align:middle;line-height:33px !important;padding:0;text-align:center;text-decoration:none!important; text-shadow: 0 1px 1px rgba(34, 34, 34, 0.05);}.kofitext a{color:#fff !important;text-decoration:none:important;}.kofitext a:hover{color:#fff !important;text-decoration:none}a.kofi-button{box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);line-height:36px!important;min-width:150px;display:inline-block!important;background-color:#29abe0;padding:2px 12px !important;text-align:center !important;border-radius:7px;color:#fff;cursor:pointer;overflow-wrap:break-word;vertical-align:middle;border:0 none #fff !important;font-family:'Quicksand',Helvetica,Century Gothic,sans-serif !important;text-decoration:none;text-shadow:none;font-weight:700!important;font-size:14px !important}a.kofi-button:visited{color:#fff !important;text-decoration:none !important}a.kofi-button:hover{opacity:.85;color:#f5f5f5 !important;text-decoration:none !important}a.kofi-button:active{color:#f5f5f5 !important;text-decoration:none !important}.kofitext img.kofiimg {height:15px!important;width:22px!important;display: initial;animation: kofi-wiggle 3s infinite;}@keyframes kofi-wiggle{0%{transform:rotate(0) scale(1)}60%{transform:rotate(0) scale(1)}75%{transform:rotate(0) scale(1.12)}80%{transform:rotate(0) scale(1.1)}84%{transform:rotate(-10deg) scale(1.1)}88%{transform:rotate(10deg) scale(1.1)}92%{transform:rotate(-10deg) scale(1.1)}96%{transform:rotate(10deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}</style><link href="https://fonts.googleapis.com/css?family=Quicksand:400,700" rel="stylesheet" type="text/css"><div class="btn-container"><a title="Support me on ko-fi.com" class="kofi-button" style="background-color:#cba6f7;" href="https://ko-fi.com/Q5Q11B7WUD" target="_blank"> <span class="kofitext"><img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">Support me on Ko-fi</span></a></div>

    </div>
  </div>

  <div id="avatarModal" class="modal">
    <span class="close">×</span>
    <img class="modal-content" id="fullAvatar">
  </div>

  <script>
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      body.classList.add('light-theme');
      themeToggle.textContent = '🌙';
    } else {
      themeToggle.textContent = '🌞';
    }

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLightTheme = body.classList.contains('light-theme');
      localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
      themeToggle.textContent = isLightTheme ? '🌙' : '🌞';
    });

    let isCooldownActive = false;
    let cooldownTime = 3;
    let spamCount = 0;

    function startCooldown(seconds) {
      const fetchButton = document.getElementById('fetchButton');
      const usernameInput = document.getElementById('usernameInput');
      const cooldownTimer = document.getElementById('cooldownTimer');

      isCooldownActive = true;
      fetchButton.disabled = true;
      usernameInput.disabled = true;
      cooldownTimer.style.display = 'block';

      let remainingTime = seconds;
      cooldownTimer.textContent = `CoolDown: Please wait ${remainingTime} seconds before fetching again.`;

      const interval = setInterval(() => {
        remainingTime -= 1;
        cooldownTimer.textContent = `CoolDown: Please wait ${remainingTime} seconds before fetching again.`;

        if (remainingTime <= 0) {
          clearInterval(interval);
          fetchButton.disabled = false;
          usernameInput.disabled = false;
          cooldownTimer.style.display = 'none';
          isCooldownActive = false;
          spamCount = 0;
        }
      }, 1000);
    }

    const countryMap = {
      "AF": "Afghanistan",
      "AL": "Albania",
      "DZ": "Algeria",
      "AS": "American Samoa",
      "AD": "Andorra",
      "AO": "Angola",
      "AI": "Anguilla",
      "AQ": "Antarctica",
      "AG": "Antigua and Barbuda",
      "AR": "Argentina",
      "AM": "Armenia",
      "AW": "Aruba",
      "AU": "Australia",
      "AT": "Austria",
      "AZ": "Azerbaijan",
      "BS": "Bahamas",
      "BH": "Bahrain",
      "BD": "Bangladesh",
      "BB": "Barbados",
      "BY": "Belarus",
      "BE": "Belgium",
      "BZ": "Belize",
      "BJ": "Benin",
      "BM": "Bermuda",
      "BT": "Bhutan",
      "BO": "Bolivia",
      "BA": "Bosnia and Herzegovina",
      "BW": "Botswana",
      "BR": "Brazil",
      "IO": "British Indian Ocean Territory",
      "BN": "Brunei",
      "BG": "Bulgaria",
      "BF": "Burkina Faso",
      "BI": "Burundi",
      "CV": "Cabo Verde",
      "KH": "Cambodia",
      "CM": "Cameroon",
      "CA": "Canada",
      "KY": "Cayman Islands",
      "CF": "Central African Republic",
      "TD": "Chad",
      "CL": "Chile",
      "CN": "China",
      "CX": "Christmas Island",
      "CC": "Cocos (Keeling) Islands",
      "CO": "Colombia",
      "KM": "Comoros",
      "CG": "Congo",
      "CD": "Congo (Democratic Republic of the)",
      "CK": "Cook Islands",
      "CR": "Costa Rica",
      "CI": "Côte d'Ivoire",
      "HR": "Croatia",
      "CU": "Cuba",
      "CW": "Curaçao",
      "CY": "Cyprus",
      "CZ": "Czechia",
      "DK": "Denmark",
      "DJ": "Djibouti",
      "DM": "Dominica",
      "DO": "Dominican Republic",
      "EC": "Ecuador",
      "EG": "Egypt",
      "SV": "El Salvador",
      "GQ": "Equatorial Guinea",
      "ER": "Eritrea",
      "EE": "Estonia",
      "SZ": "Eswatini",
      "ET": "Ethiopia",
      "FK": "Falkland Islands",
      "FO": "Faroe Islands",
      "FJ": "Fiji",
      "FI": "Finland",
      "FR": "France",
      "GF": "French Guiana",
      "PF": "French Polynesia",
      "TF": "French Southern Territories",
      "GA": "Gabon",
      "GM": "Gambia",
      "GE": "Georgia",
      "DE": "Germany",
      "GH": "Ghana",
      "GI": "Gibraltar",
      "GR": "Greece",
      "GL": "Greenland",
      "GD": "Grenada",
      "GP": "Guadeloupe",
      "GU": "Guam",
      "GT": "Guatemala",
      "GG": "Guernsey",
      "GN": "Guinea",
      "GW": "Guinea-Bissau",
      "GY": "Guyana",
      "HT": "Haiti",
      "HM": "Heard Island and McDonald Islands",
      "VA": "Holy See",
      "HN": "Honduras",
      "HK": "Hong Kong",
      "HU": "Hungary",
      "IS": "Iceland",
      "IN": "India",
      "ID": "Indonesia",
      "IR": "Iran",
      "IQ": "Iraq",
      "IE": "Ireland",
      "IM": "Isle of Man",
      "IL": "Israel",
      "IT": "Italy",
      "JM": "Jamaica",
      "JP": "Japan",
      "JE": "Jersey",
      "JO": "Jordan",
      "KZ": "Kazakhstan",
      "KE": "Kenya",
      "KI": "Kiribati",
      "KP": "North Korea",
      "KR": "South Korea",
      "KW": "Kuwait",
      "KG": "Kyrgyzstan",
      "LA": "Laos",
      "LV": "Latvia",
      "LB": "Lebanon",
      "LS": "Lesotho",
      "LR": "Liberia",
      "LY": "Libya",
      "LI": "Liechtenstein",
      "LT": "Lithuania",
      "LU": "Luxembourg",
      "MO": "Macao",
      "MG": "Madagascar",
      "MW": "Malawi",
      "MY": "Malaysia",
      "MV": "Maldives",
      "ML": "Mali",
      "MT": "Malta",
      "MH": "Marshall Islands",
      "MQ": "Martinique",
      "MR": "Mauritania",
      "MU": "Mauritius",
      "YT": "Mayotte",
      "MX": "Mexico",
      "FM": "Micronesia",
      "MD": "Moldova",
      "MC": "Monaco",
      "MN": "Mongolia",
      "ME": "Montenegro",
      "MS": "Montserrat",
      "MA": "Morocco",
      "MZ": "Mozambique",
      "MM": "Myanmar",
      "NA": "Namibia",
      "NR": "Nauru",
      "NP": "Nepal",
      "NL": "Netherlands",
      "NC": "New Caledonia",
      "NZ": "New Zealand",
      "NI": "Nicaragua",
      "NE": "Niger",
      "NG": "Nigeria",
      "NU": "Niue",
      "NF": "Norfolk Island",
      "MK": "North Macedonia",
      "NO": "Norway",
      "OM": "Oman",
      "PK": "Pakistan",
      "PW": "Palau",
      "PS": "Palestine",
      "PA": "Panama",
      "PG": "Papua New Guinea",
      "PY": "Paraguay",
      "PE": "Peru",
      "PH": "Philippines",
      "PN": "Pitcairn",
      "PL": "Poland",
      "PT": "Portugal",
      "PR": "Puerto Rico",
      "QA": "Qatar",
      "RE": "Réunion",
      "RO": "Romania",
      "RU": "Russia",
      "RW": "Rwanda",
      "BL": "Saint Barthélemy",
      "SH": "Saint Helena",
      "KN": "Saint Kitts and Nevis",
      "LC": "Saint Lucia",
      "MF": "Saint Martin",
      "PM": "Saint Pierre and Miquelon",
      "VC": "Saint Vincent and the Grenadines",
      "WS": "Samoa",
      "SM": "San Marino",
      "ST": "São Tomé and Príncipe",
      "SA": "Saudi Arabia",
      "SN": "Senegal",
      "RS": "Serbia",
      "SC": "Seychelles",
      "SL": "Sierra Leone",
      "SG": "Singapore",
      "SX": "Sint Maarten",
      "SK": "Slovakia",
      "SI": "Slovenia",
      "SB": "Solomon Islands",
      "SO": "Somalia",
      "ZA": "South Africa",
      "GS": "South Georgia and the South Sandwich Islands",
      "SS": "South Sudan",
      "ES": "Spain",
      "LK": "Sri Lanka",
      "SD": "Sudan",
      "SR": "Suriname",
      "SJ": "Svalbard and Jan Mayen",
      "SE": "Sweden",
      "CH": "Switzerland",
      "SY": "Syria",
      "TW": "Taiwan",
      "TJ": "Tajikistan",
      "TZ": "Tanzania",
      "TH": "Thailand",
      "TL": "Timor-Leste",
      "TG": "Togo",
      "TK": "Tokelau",
      "TO": "Tonga",
      "TT": "Trinidad and Tobago",
      "TN": "Tunisia",
      "TR": "Turkey",
      "TM": "Turkmenistan",
      "TC": "Turks and Caicos Islands",
      "TV": "Tuvalu",
      "UG": "Uganda",
      "UA": "Ukraine",
      "AE": "United Arab Emirates",
      "GB": "United Kingdom",
      "US": "United States",
      "UM": "United States Minor Outlying Islands",
      "UY": "Uruguay",
      "UZ": "Uzbekistan",
      "VU": "Vanuatu",
      "VE": "Venezuela",
      "VN": "Vietnam",
      "VG": "Virgin Islands (British)",
      "VI": "Virgin Islands (U.S.)",
      "WF": "Wallis and Futuna",
      "EH": "Western Sahara",
      "YE": "Yemen",
      "ZM": "Zambia",
      "ZW": "Zimbabwe"
    };

    function getCountryName(countryCode) {
      return countryMap[countryCode.toUpperCase()] || 'Unknown Country';
    }

    async function fetchData() {
      if (isCooldownActive) {
        spamCount += 1;
        if (spamCount >= 5) cooldownTime = 10;
        alert(`Cooldown is active. Please wait ${cooldownTime} seconds before fetching again.`);
        return;
      }

      const username = document.getElementById('usernameInput').value.trim();
      const avatarImg = document.getElementById('avatar');
      const responseDisplay = document.getElementById('responseDisplay');
      const downloadContainer = document.getElementById('downloadContainer');
      avatarImg.style.display = 'none';
      downloadContainer.style.display = 'none';

      if (!username) {
        responseDisplay.textContent = "Please enter a username.";
        return;
      }

      startCooldown(cooldownTime);

      responseDisplay.innerHTML = `
        <div style="text-align: center;">
          <div class="loader"></div>
          <span style="font-size: 14px; color: gray;">Fetching data, It may take 5 seconds. "Please ensure that the entered username is correct"</span>
        </div>`;

      const workerUrl = `https://nopean.click/`;

      try {
        const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            responseDisplay.textContent = "Rate limit exceeded. Please try again in a few seconds.";
          } else {
            responseDisplay.textContent = "Error: Please ensure the username is correct, with no '@' symbol.";
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.error) {
          responseDisplay.textContent = "Error: Unable to fetch user data. Please check the username or try again later.";
          return;
        }

        let displayText = '';

        if (data.nickname) {
          const regionImageUrl = data.region ? getFlagImageUrl(data.region) : '';
          const countryName = data.region ? getCountryName(data.region) : 'Unknown Country';

          displayText += `👤 Nickname: ${data.nickname}\n`;
          displayText += `👤 Username: ${data.username}\n`;
          displayText += `🌍 Region: ${data.region} ${regionImageUrl ? `<img src="${regionImageUrl}" class="flag" alt="Flag">` : ''} (${countryName})\n`;
          displayText += `🌐 Language: ${data.language}\n`;

          if (data.about) {
            const aboutText = data.about.replace(/\n/g, ' ');
            displayText += `📜 About: ${aboutText}\n`;
          } else {
            displayText += `📜 About: User has no about\n`;
          }

          displayText += `🆔 User ID: ${data.userId}\n`;
          displayText += `📅 Account Created: ${data.accountCreated}\n`;
          displayText += `🕒 Nickname Modified: ${data.nicknameModified}\n\n`;

          if (data.stats) {
            displayText += `📊 Stats:\n`;
            displayText += `👥 Followers: ${data.stats.followers}\n`;
            displayText += `👤 Following: ${data.stats.following}\n`;
            displayText += `❤️ Hearts: ${data.stats.hearts}\n`;
            displayText += `🎥 Videos: ${data.stats.videos}\n`;
            displayText += `👫 Friends: ${data.stats.friends}\n`;
          }
        }

        if (data.avatar) {
          avatarImg.src = data.avatar;
          avatarImg.style.display = 'block';
          downloadContainer.style.display = 'block';
          downloadButton.onclick = () => downloadImage(data.avatar, `${username}-avatar`);
        }

        responseDisplay.innerHTML = displayText;

      } catch (error) {
        console.error("Fetch error:", error);
        responseDisplay.textContent = "Error: Please make sure the entered username is correct, and does not include the @ symbol.";
      }
    }

    async function pasteUsername() {
      try {
        const text = await navigator.clipboard.readText();
        document.getElementById('usernameInput').value = text;
      } catch (error) {
        console.error("Failed to paste:", error);
      }
    }

    document.addEventListener('keydown', (event) => {
      const inputField = document.getElementById('usernameInput');
      if (document.activeElement !== inputField) inputField.focus();
    });

    document.getElementById('usernameInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (isCooldownActive) {
          spamCount += 1;
          if (spamCount >= 5) cooldownTime = 10;
          alert(`Cooldown is active. Please wait ${cooldownTime} seconds before fetching again.`);
        } else {
          fetchData();
        }
      }
    });

    document.getElementById('fetchButton').addEventListener('click', fetchData);

    function getFlagImageUrl(countryCode) {
      return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
    }

    function downloadImage(url, filename) {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading image:', error));
    }

    const modal = document.getElementById('avatarModal');
    const modalImg = document.getElementById('fullAvatar');
    const avatarImg = document.getElementById('avatar');
    const closeModal = document.getElementsByClassName('close')[0];

    avatarImg.onclick = function () {
      modal.style.display = 'block';
      modalImg.src = this.src;
    }

    closeModal.onclick = function () {
      modal.style.display = 'none';
    }

    window.onclick = function (event) {
      if (event.target == modal) modal.style.display = 'none';
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') modal.style.display = 'none';
    });
  </script>

</body>
