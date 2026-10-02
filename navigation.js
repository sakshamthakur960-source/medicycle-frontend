/* MediCycle prototype navigation layer.
   Generated from the exported Stitch screens. Keeps the Stitch markup/styles intact
   and only adds page-to-page navigation for the demo prototype.
*/
(function () {
  'use strict';

  const ROUTES = {
    home: '18-good-morning-ramesh.html',
    'return-medicines': '01-add-items-and-choose-route.html',
    'eco-wallet': '11-redeem-rewards.html',
    'disposal-history': '07-live-courier-arrival-tracking.html',
    profile: '08-ananya-sharma.html',

    dashboard: '14-dashboard.html',
    'verify-scan': '12-verify-scan.html',
    'vault-storage': '13-vault-storage.html',
    'courier-pickups': '16-east-bengaluru-eco-corridor-04.html',
    'staff-commission': '15-staff-commission.html',

    'route-map': '16-east-bengaluru-eco-corridor-04.html',
    'pickups-manifest': '17-scan-bin-1-of-2-bin-a-04.html',
    'chain-of-custody': '03-hub-handover.html',
    'driver-profile': '16-east-bengaluru-eco-corridor-04.html',

    // Aliases used by the exported Stitch bottom navigation.
    'home-dashboard': '18-good-morning-ramesh.html',
    'user-profile': '08-ananya-sharma.html',
    'scan-seal': '17-scan-bin-1-of-2-bin-a-04.html'
  };

  const BUTTON_ROUTES = [
    // Citizen return flow
    [/proceed to channel confirmation/i, '04-select-pickup-items.html'],
    [/coordinate route slot/i, '05-slot-coordination.html'],
    [/review packaging.*guidelines/i, '06-packaging-guidelines.html'],
    [/confirm reverse pickup booking/i, '07-live-courier-arrival-tracking.html'],
    [/cancel or reschedule pickup/i, '05-slot-coordination.html'],
    [/need to reschedule or change address/i, '05-slot-coordination.html'],

    // Citizen profile / wallet
    [/redeem rewards/i, '11-redeem-rewards.html'],
    [/log out of medicycle/i, '09-user-login.html'],
    [/view chain of custody.*disposal pass/i, '07-live-courier-arrival-tracking.html'],
    [/redeem credits/i, '11-redeem-rewards.html'],

    // Pharmacy / staff flow
    [/launch camera scanner/i, '12-verify-scan.html'],
    [/manual item search.*entry/i, '12-verify-scan.html'],
    [/verify.*accept handoff/i, '02-stop-verification.html'],
    [/request early logistics dispatch pickup/i, '16-east-bengaluru-eco-corridor-04.html'],
    [/confirm.*seal in tamper bag/i, '13-vault-storage.html'],
    [/flag ineligible.*hazardous item/i, '14-dashboard.html'],
    [/seal bag.*generate courier manifest/i, '16-east-bengaluru-eco-corridor-04.html'],
    [/request emergency bin swap/i, '14-dashboard.html'],

    // Driver flow
    [/arrived at pharmacy counter/i, '17-scan-bin-1-of-2-bin-a-04.html'],
    [/confirm custody.*load into ev/i, '02-stop-verification.html'],
    [/proceed to scan digital seals/i, '17-scan-bin-1-of-2-bin-a-04.html'],
    [/complete shift handover.*release custody/i, '16-east-bengaluru-eco-corridor-04.html'],

    // Drop-off flow
    [/view route \(1\.1 km\)/i, '10-drop-off-finder.html'],

    // Missing primary actions found during audit
    [/report discrepancy \/ damaged seal/i, '16-east-bengaluru-eco-corridor-04.html'],
    [/scan next bin/i, '17-scan-bin-1-of-2-bin-a-04.html'],

    // Pharmacy dashboard actions
    [/verify & accept handoff/i, '02-stop-verification.html'],

    // Verification / storage actions
    [/confirm & seal in tamper bag/i, '13-vault-storage.html'],
    [/flag ineligible \/ hazardous item/i, '14-dashboard.html'],
    [/seal bag & generate courier manifest/i, '16-east-bengaluru-eco-corridor-04.html'],

    // Citizen profile / rewards actions
    [/wallet history/i, '11-redeem-rewards.html'],
    [/download annual disposal certificate/i, '11-redeem-rewards.html'],

  ];

  function cleanText(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function go(target) {
    if (!target) return;
    window.location.href = target;
  }

  function back() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      go(ROUTES.home);
    }
  }

  function attachPathNavigation() {
    document.querySelectorAll('a[data-path]').forEach(function (el) {
      const path = el.getAttribute('data-path');
      if (!ROUTES[path]) return;
      el.setAttribute('href', ROUTES[path]);
      el.addEventListener('click', function (event) {
        event.preventDefault();
        go(ROUTES[path]);
      });
    });
  }

  function attachButtonNavigation() {
    document.querySelectorAll('button').forEach(function (button) {
      const text = cleanText(button);
      if (!text) return;

      // Back buttons exported by Stitch already call history.back(). Replace their
      // handler with our resilient fallback, so a directly opened page still works.
      const aria = (button.getAttribute('aria-label') || '').toLowerCase();
      if (aria.includes('go back') || aria === 'back' || text === 'arrow_back') {
        button.onclick = function (event) {
          if (event) event.preventDefault();
          back();
        };
        return;
      }

      // Keep the exported login validation: navigate only after a non-empty identifier.
      if (/^log in to medicycle/i.test(text)) {
        button.onclick = function (event) {
          if (event) event.preventDefault();
          const input = document.getElementById('user-identifier');
          if (!input || !input.value.trim()) {
            if (typeof window.handleLogin === 'function') window.handleLogin();
            return;
          }
          if (typeof window.handleLogin === 'function') window.handleLogin();
          setTimeout(function () { go('18-good-morning-ramesh.html'); }, 0);
        };
        return;
      }

      for (const pair of BUTTON_ROUTES) {
        if (pair[0].test(text)) {
          const target = pair[1];
          button.addEventListener('click', function () {
            setTimeout(function () { go(target); }, 0);
          });
          break;
        }
      }
    });
  }

  window.MCNavigate = { go: go, back: back, routes: ROUTES };

  attachPathNavigation();
  attachButtonNavigation();
})();
