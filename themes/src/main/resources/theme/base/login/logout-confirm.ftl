<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section == "header">
        ${msg("logoutConfirmTitle")}
    <#elseif section == "form">
        <div id="kc-logout-confirm" class="content-area">
            <p class="instruction">${msg("logoutConfirmHeader")}</p>

            <form id="auto-logout-form" class="form-actions" action="${url.logoutConfirmAction}" method="POST">
                <input type="hidden" name="session_code" value="${logoutConfirm.code}">
                <input type="hidden" name="confirmLogout" value="true" />
            </form>

            <script>
                function isMobileDevice() {
                    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                }

                window.addEventListener('DOMContentLoaded', function () {
                    // Submit logout form
                    document.getElementById('auto-logout-form').submit();

                    // After 1 second, redirect or attempt close (with fallback)
                    setTimeout(function () {
                        const isMobile = isMobileDevice();

                        // If in-app (custom WebView), window.close might work
                        // If not, fallback to redirect for both mobile and desktop
                        try {
                            window.close();
                        } catch (e) {
                            // Do nothing — fallback below will handle it
                        }

                        // Always redirect to fallback location
                        window.location.href = 'https://im.beep.gov.pk';
                    }, 1000);
                });
            </script>

            <div id="kc-info-message">
                <#if !logoutConfirm.skipLink && (client.baseUrl)?has_content>
                    <p><a href="${client.baseUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                </#if>
            </div>

            <div class="clearfix"></div>
        </div>
    </#if>
</@layout.registrationLayout>
