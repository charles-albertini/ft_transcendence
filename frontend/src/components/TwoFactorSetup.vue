<template>
  <div class="twofa-setup-container">
    <div class="twofa-content">
      <!-- Header -->
      <div class="twofa-header">
        <div class="security-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h2>{{ $t('twoFactorSetup') }}</h2>
        <p>{{ $t('twoFactorDescription') }}</p>
      </div>

      <!-- Option d'activation -->
      <div class="twofa-option">
        <div class="option-toggle">
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="enableTwoFA" 
              @change="handleToggleChange"
              :disabled="loading"
            >
            <span class="slider"></span>
          </label>
          <div class="option-text">
            <h3>{{ $t('enableTwoFactor') }}</h3>
            <p>{{ $t('twoFactorBenefit') }}</p>
          </div>
        </div>
      </div>

      <!-- Section de configuration 2FA (visible si activé) -->
      <div v-if="enableTwoFA" class="twofa-setup">
        <div v-if="!qrCodeGenerated" class="generating-section">
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ $t('generatingQRCode') }}</p>
          </div>
        </div>

        <div v-else class="qr-section">
          <!-- Instructions -->
          <div class="instructions">
            <h4>{{ $t('setupInstructions') }}</h4>
            <ol>
              <li>{{ $t('downloadAuthApp') }}</li>
              <li>{{ $t('scanQRCode') }}</li>
              <li>{{ $t('enterVerificationCode') }}</li>
            </ol>
          </div>

          <!-- QR Code -->
          <div class="qr-display">
            <div class="qr-container">
              <img v-if="qrCode" :src="qrCode" alt="2FA QR Code" class="qr-image" />
              <div v-else class="qr-error">
                <p>{{ $t('qrCodeError') }}</p>
                <button @click="regenerateQR" class="retry-btn">{{ $t('retry') }}</button>
              </div>
            </div>
          </div>

          <!-- Clé secrète (en cas de problème avec le QR code) -->
          <div class="secret-section">
            <p>{{ $t('cantScanQR') }}</p>
            <div class="secret-display">
              <code>{{ secret }}</code>
              <button @click="copySecret" class="copy-btn">{{ $t('copy') }}</button>
            </div>
          </div>

          <!-- Vérification du code -->
          <div class="verification-section">
            <h4>{{ $t('verifySetup') }}</h4>
            <div class="code-input-group">
              <input 
                type="text" 
                v-model="verificationCode" 
                :placeholder="$t('enterCode')"
                maxlength="6"
                pattern="[0-9]*"
                inputmode="numeric"
                class="code-input"
                :class="{ error: verificationError }"
                @keyup.enter="verifyCode"
                @input="onCodeInput"
              >
              <button 
                @click="verifyCode" 
                :disabled="!verificationCode || verificationCode.length !== 6 || verifying"
                class="verify-btn"
              >
                <span v-if="verifying">{{ $t('verifying') }}...</span>
                <span v-else>{{ $t('verify') }}</span>
              </button>
            </div>
            <p v-if="verificationError" class="error-message">{{ verificationError }}</p>
            <p v-if="verificationSuccess" class="success-message">{{ $t('verificationSuccess') }}</p>
          </div>
        </div>
      </div>

      <!-- État de confirmation finale -->
      <div v-if="setupCompleted" class="completion-section">
        <div class="success-state">
          <div class="success-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3>{{ $t('setupComplete') }}</h3>
          <p>{{ $t('twoFactorEnabled') }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="action-buttons">
        <button 
          v-if="!setupCompleted" 
          @click="skipSetup" 
          class="skip-btn"
          :disabled="loading"
        >
          {{ $t('skipForNow') }}
        </button>
        <button 
          v-if="setupCompleted" 
          @click="completeSetup" 
          class="continue-btn"
        >
          {{ $t('continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { twoFactorService } from '../services/twoFactorAPI'

const { t } = useI18n()

// Props
const props = defineProps<{
  userToken: string
}>()

// Events
const emit = defineEmits<{
  'setup-complete': [enabled: boolean]
  'setup-skipped': []
}>()

// Reactive state
const enableTwoFA = ref(false)
const loading = ref(false)
const qrCodeGenerated = ref(false)
const qrCode = ref('')
const secret = ref('')
const verificationCode = ref('')
const verificationError = ref('')
const verificationSuccess = ref(false)
const verifying = ref(false)
const setupCompleted = ref(false)

// Gestion du toggle 2FA
async function handleToggleChange() {
  if (enableTwoFA.value && !qrCodeGenerated.value) {
    await generateQRCode()
  }
}

// Génération du QR code
async function generateQRCode() {
  loading.value = true
  try {
    const response = await twoFactorService.enable2FA(props.userToken)
    
    qrCode.value = response.qrCode
    secret.value = response.secret
    qrCodeGenerated.value = true
  } catch (error) {
    verificationError.value = t('qrGenerationError')
  } finally {
    loading.value = false
  }
}

// Régénération du QR code en cas d'erreur
async function regenerateQR() {
  qrCodeGenerated.value = false
  qrCode.value = ''
  secret.value = ''
  await generateQRCode()
}

// Copie de la clé secrète
async function copySecret() {
  try {
    await navigator.clipboard.writeText(secret.value)
  } catch (error) {
    // Gérer l'erreur silencieusement
  }
}

// Validation de l'input en temps réel
function onCodeInput(event: Event) {
  const target = event.target as HTMLInputElement
  const numericOnly = target.value.replace(/[^0-9]/g, '')
  verificationCode.value = numericOnly
  
  if (numericOnly.length <= 6) {
    verificationError.value = ''
  }
}

// Vérification du code 2FA
async function verifyCode() {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    verificationError.value = t('codeMustBe6Digits')
    return
  }

  if (!/^\d{6}$/.test(verificationCode.value)) {
    verificationError.value = t('codeOnlyDigits')
    return
  }

  verifying.value = true
  verificationError.value = ''
  
  try {
    const result = await twoFactorService.verify2FA(props.userToken, verificationCode.value)
    
    if (result.success) {
      verificationSuccess.value = true
      setupCompleted.value = true
      setTimeout(() => {
        emit('setup-complete', true)
      }, 1500)
    } else {
      verificationError.value = result.message || t('invalidCode')
    }
  } catch (error) {
    verificationError.value = t('verificationError')
  } finally {
    verifying.value = false
  }
}

// Skip setup
function skipSetup() {
  emit('setup-skipped')
}

// Complete setup
function completeSetup() {
  emit('setup-complete', true)
}
</script>

<style scoped>
.twofa-setup-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.twofa-header {
  text-align: center;
  margin-bottom: 2rem;
}

.security-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  color: #10b981;
}

.twofa-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.twofa-header p {
  color: #6b7280;
}

.twofa-option {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.option-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #10b981;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.option-text h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.option-text p {
  color: #6b7280;
  font-size: 0.9rem;
}

.twofa-setup {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.instructions {
  margin-bottom: 2rem;
}

.instructions h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.instructions ol {
  color: #6b7280;
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.5rem;
}

.qr-display {
  text-align: center;
  margin-bottom: 2rem;
}

.qr-container {
  display: inline-block;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.qr-image {
  max-width: 200px;
  height: auto;
}

.qr-error {
  padding: 2rem;
  text-align: center;
  color: #ef4444;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.secret-section {
color: #ef4444;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.secret-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.secret-display code {
  flex: 1;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: monospace;
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.verification-section h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.code-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.code-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
  font-family: monospace;
}

.code-input.error {
  border-color: #ef4444;
}

.verify-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.verify-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
}

.success-message {
  color: #10b981;
  font-size: 0.875rem;
}

.completion-section {
  text-align: center;
  padding: 2rem;
}

.success-state {
  color: #10b981;
}

.success-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
}

.success-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.skip-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
}

.continue-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
</style>
