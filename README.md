# FilNoteFEVM Frontend

FilNoteFEVM is a decentralized SP (Storage Provider) pledge investment and financing DApp built on Filecoin FEVM.

## Overview

FilNoteFEVM is a decentralized application that allows users to create, review, and invest in Filecoin storage provider pledge notes. The application is built with Quasar Framework and Vue 3, developed in TypeScript, uses Reown AppKit for wallet connectivity, and interacts with smart contracts via ethers.js.

The application runs on the **Filecoin Calibration testnet**, providing a decentralized platform for storage providers and investors to engage in financing and investment activities.

## Features

### 1. Note Creation

- Users can create new investment notes
- Set target amount (FIL)
- Set borrowing days
- Set interest rate (in basis points, where 1 bps = 0.01%)
- Notes are created with `INIT` status

### 2. Note Review

- Auditors can review notes in `INIT` status
- Upload PDF contract file (required)
- Optionally upload privacy certificate file (will be encrypted)
- Add public information (jsonData) - required when privacy certificate is provided
- System generates verification UUID requiring wallet signature
- After review, note status changes to `PENDING`

### 3. Note Investment

- Investors can invest in notes with `PENDING` status
- Must read and accept risk disclosure statement (10-second countdown)
- Can view contract and privacy certificate preview (public information) before investment
- Investment amount equals the note's target amount
- After investment, note status changes to `ACTIVE`

### 4. Note Management

- View all notes in a list
- Filter functionality:
  - My investments: Show only notes invested by current user
  - My creations: Show only notes created by current user
- Display different action buttons based on note status

### 5. Agreement Details

- View detailed note information
- Display creator, investor, protocol contract address
- Show funding amount, node balance, etc.
- Support withdrawal operations (for creators and investors)

### 6. Wallet Connection

- Support for multiple wallet connections via Reown AppKit
- Auto-detect connected wallets
- Display wallet address (short format)
- Support account switching and disconnection

## Tech Stack

### Core Framework

- **Quasar Framework 2.x**: Full-featured Vue.js framework with rich UI components
- **Vue 3.5.20**: Build reactive user interfaces using Composition API
- **TypeScript 5.9.2**: Provides type safety and better development experience

### State Management

- **Pinia 3.0.1**: Official state management library for Vue 3

### Routing

- **Vue Router 4.0.12**: Route management using History mode

### Blockchain Related

- **ethers.js 6.15.0**: Interact with Filecoin FEVM smart contracts
- **Reown AppKit 1.8.4**: Wallet connection and account management
- **@reown/appkit-adapter-ethers 1.8.4**: Ethers.js adapter

### HTTP Client

- **Axios 1.2.1**: For backend API communication

### UI and Styling

- **Quasar UI**: Material Design component library
- **Tailwind CSS**: Utility-first CSS framework
- **SCSS**: CSS preprocessor
- **Font Awesome 6**: Icon library

### Utility Libraries

- **BigNumber.js 9.3.1**: Big number arithmetic
- **ethers-decode-error 2.1.3**: Ethereum error decoding
- **SweetAlert2 11.23.0**: Beautiful popup notifications

### Internationalization

- **Vue I18n 11.0.0**: Multi-language support

## Requirements

- **Node.js**: ^20 || ^22 || ^24 || ^26 || ^28
- **npm**: >= 6.13.4 or **yarn**: >= 1.21.1

## Installation

Install the dependencies:

```bash
yarn
# or
npm install
```

## Environment Variables

Create a `.env` file in the project root directory and configure the following environment variables:

```env
# API Base URL (backend service address)
API_BASE_URL=https://your-api-url.com

# Reown AppKit Project ID (get from https://cloud.reown.com)
APPKIT_PROJECT_ID=your-project-id
```

### Getting Reown AppKit Project ID

1. Visit [Reown Cloud](https://cloud.reown.com)
2. Create a new project or select an existing one
3. Copy the project ID to your `.env` file

## Development

Start the app in development mode (hot-code reloading, error reporting, etc.):

```bash
quasar dev
# or
yarn dev
# or
npm run dev
```

The development server will automatically open in your browser at `http://localhost:9000`.

## Linting

Lint the files:

```bash
yarn lint
# or
npm run lint
```

## Formatting

Format the files:

```bash
yarn format
# or
npm run format
```

## Build

Build the app for production:

```bash
quasar build
# or
yarn build
# or
npm run build
```

The build output will be in the `dist/spa` directory and can be deployed to any static file server.

## Project Structure

```
src/
├── boot/                    # Boot configuration files (executed in order)
│   ├── appkit.ts           # Reown AppKit configuration
│   │                        # - Configure wallet connection
│   │                        # - Set network (Filecoin Calibration)
│   │                        # - Configure adapter (EthersAdapter)
│   ├── axios.ts            # Axios HTTP client configuration
│   │                        # - Create API instance
│   │                        # - Configure response interceptors
│   │                        # - Error handling
│   └── i18n.ts             # Internationalization configuration
│                            # - Configure Vue I18n
│                            # - Load language resources
│
├── common/                  # Common modules
│   ├── api.ts              # API interface definitions
│   │                        # - getVerifyUuid: Get verification UUID
│   │                        # - uploadContract: Upload contract file
│   ├── const.ts            # Constants
│   │                        # - Network: Filecoin Calibration network config
│   │                        # - NoteStatus: Note status mapping
│   ├── dApp.ts             # DApp utility functions
│   │                        # - contractRead: Read FilNote contract
│   │                        # - contractReadProtocols: Read protocol contract
│   ├── FilNoteABI.ts       # FilNote main contract ABI
│   ├── ProtocolsABI.ts     # Protocol contract ABI
│   ├── tools.ts            # Utility function collection
│   │                        # - Address handling: handleAddress, isZeroAddress
│   │                        # - Amount conversion: weiToEther, filToWei
│   │                        # - Rate conversion: bpsToPercentage
│   │                        # - Interest calculation: calculateInterest
│   │                        # - Error handling: handleEthErr
│   │                        # - Popup alerts: swalAlert
│   │                        # - Time judgment: justExpiryTime
│   └── types.ts            # TypeScript type definitions
│                            # - Note: Note interface
│                            # - WriteArgs: Write contract arguments
│                            # - ReadArgs: Read contract arguments
│                            # - WriteProps: Write component props
│
├── components/              # Vue components
│   ├── AgreementDetails.vue    # Agreement details dialog
│   │                            # - Display detailed note information
│   │                            # - Display protocol contract information
│   │                            # - Support withdrawal operations
│   ├── ConnectingWallets.vue   # Wallet connection component
│   │                            # - Display connect/disconnect button
│   │                            # - Display wallet address
│   │                            # - Listen to account changes
│   ├── CreateNote.vue          # Create note dialog
│   │                            # - Form validation
│   │                            # - Call smart contract to create note
│   ├── InvestmentRecognition.vue # Investment risk confirmation dialog
│   │                              # - Display risk disclosure statement
│   │                              # - View contract PDF
│   │                              # - View privacy certificate preview (public information)
│   │                              # - 10-second countdown
│   │                              # - Confirm investment operation
│   ├── NoteItem.vue            # Note card component
│   │                            # - Display basic note information
│   │                            # - Show action buttons based on status and permissions
│   │                            # - Integrate review, investment, etc.
│   ├── NoteCountdown.vue       # Note countdown component
│   │                            # - Display expiry time countdown
│   ├── ReadContract.vue        # Read contract component (slot component)
│   │                            # - Provide read method
│   │                            # - Encapsulate contract reading logic
│   ├── ReviewNote.vue          # Review note dialog
│   │                            # - Upload contract file (PDF, required)
│   │                            # - Upload privacy certificate file (PDF, optional)
│   │                            # - Add public information (jsonData, required if privacy certificate provided)
│   │                            # - Get verification UUID
│   │                            # - Wallet signature
│   │                            # - Upload files to backend
│   │                            # - Call smart contract to review
│   └── WriteContract.vue       # Write contract component (slot component)
│                                # - Provide write method
│                                # - Handle transaction confirmation
│                                # - Display transaction status
│                                # - Error handling
│
├── layouts/                 # Layout components
│   └── MainLayout.vue      # Main layout
│                            # - Top navigation bar
│                            # - Wallet connection button
│                            # - Footer
│                            # - Router view container
│
├── pages/                   # Page components
│   ├── IndexPage.vue       # Home page
│   │                        # - Note list display
│   │                        # - Filter functionality
│   │                        # - Create note entry
│   ├── TermsService.vue    # Terms of service page
│   │                        # - Platform terms of service
│   │                        # - User responsibility description
│   └── ErrorNotFound.vue   # 404 error page
│
├── router/                  # Router configuration
│   ├── index.ts            # Router entry (create router instance)
│   └── routes.ts           # Route definitions
│                            # - /: Redirect to /home
│                            # - /home: Home page
│                            # - /terms-service: Terms of service
│                            # - /*: 404 page
│
├── stores/                  # Pinia state management
│   ├── d-app.ts            # DApp state management
│   │                        # - address: Current wallet address
│   │                        # - addressShort: Short format address
│   │                        # - ownerAddress: Contract owner address
│   │                        # - auditors: Auditor list
│   │                        # - setAddress: Set address
│   │                        # - isAuditor: Check if auditor
│   │                        # - getAuditors: Get auditor list
│   │                        # - signMessage: Sign message
│   └── index.ts            # Store entry
│
├── i18n/                    # Internationalization resources
│   ├── en-US/              # English resources
│   │   └── index.ts        # English translations
│   └── index.ts            # i18n configuration
│
└── css/                     # Style files
    ├── app.scss            # Global styles
    ├── quasar.variables.scss # Quasar variable overrides
    └── tailwindcss/        # Tailwind CSS configuration
        ├── input.scss      # Tailwind input file
        ├── output.css      # Compiled CSS
        └── tailwind.config.js # Tailwind config
```

## Core Features

### Note Status Flow

The status flow of notes in the system:

```
INIT (Initial)
  ↓ [Auditor Review]
PENDING (Pending Investment)
  ↓ [Investor Investment]
ACTIVE (Active)
  ↓ [Expiry/Completion]
COMPLETED (Completed)
  or
DEFAULTED (Defaulted)
  or
STOP (Stopped)

[Creator/Owner can close]
INIT → CLOSED (Closed)
```

#### Status Descriptions

- **INIT (0)**: Initial state, note just created, waiting for auditor review
- **INVALID (1)**: Invalid state, note data is abnormal
- **PENDING (2)**: Pending state, reviewed and waiting for investor investment
- **CLOSED (3)**: Closed state, actively closed by creator or owner
- **ACTIVE (4)**: Active state, investor has invested, note is in effect
- **COMPLETED (5)**: Completed state, note expired normally and completed
- **DEFAULTED (6)**: Defaulted state, borrower failed to repay on time
- **STOP (7)**: Stopped state, note has been stopped

### Permission System

There are three roles in the application:

1. **Regular User**
   - Can create notes
   - Can invest in notes
   - Can view details of notes they created or invested in

2. **Auditor**
   - Has all permissions of regular users
   - Can review notes in `INIT` status
   - Must upload contract file and sign when reviewing

3. **Contract Owner**
   - Has all permissions
   - Can close any note in `INIT` status
   - Can view details of all notes

### Smart Contract Interaction

#### FilNote Main Contract

Main methods:

- `createNote(targetAmount, interestRateBps, borrowingDays)`: Create a note
- `pendingNote(noteId, contractHash, encryptedPrivacyCertificateHash, privacyCredentialsAbridgedHash)`: Review a note
- `invest(noteId)`: Invest in a note (requires sending FIL)
- `closeNote(noteId)`: Close a note
- `getNotes(offset, limit)`: Get note list
- `getAuditors()`: Get auditor list
- `owner()`: Get contract owner

#### Protocol Contract

Each active note has a corresponding protocol contract with main methods:

- `getContractInfo()`: Get contract information (funding amount, node balance, etc.)
- `withdrawFundingAmount()`: Withdraw funding amount (creator)
- `withdraw()`: Withdraw principal and interest (investor)

### API Integration

#### Get Verification UUID

```typescript
GET / verify / get - verify - uuid / { address };
```

- **Parameters**: `address` - Wallet address
- **Returns**: Verification message string
- **Usage**: Get message to sign when reviewing a note

#### Upload Contract File

```typescript
POST /verify/upload
Content-Type: multipart/form-data
```

- **Parameters**:
  - `signature`: Signature string
  - `contract`: PDF contract file (required)
  - `privacyCertificate`: PDF privacy certificate file (optional, will be encrypted)
  - `jsonData`: JSON string of public information (required if privacyCertificate is provided)
  - `address`: Wallet address
- **Returns**: Object containing:
  - `contractHash`: IPFS hash of contract file
  - `encryptedPrivacyCertificateHash`: Encrypted IPFS hash of privacy certificate (if provided)
  - `privacyCredentialsAbridgedHash`: IPFS hash of public information JSON (if provided)
- **Usage**: Upload review contract file and optional privacy certificate, returns hashes for on-chain recording

### Utility Functions

#### Address Handling

- `handleAddress(address, before, after)`: Format address to short format (e.g., `0x1234...5678`)
- `isZeroAddress(address)`: Check if address is zero address
- `openViewAddress(address)`: Open address in block explorer

#### Amount Conversion

- `weiToEther(wei, processingAmount)`: Convert Wei to FIL (Ether units)
- `filToWei(fil)`: Convert FIL to Wei
- `processingBigAmount(input, decimalPlaces)`: Format large amount display (add thousand separators)

#### Rate Processing

- `bpsToPercentage(bps)`: Convert basis points (bps) to percentage (1 bps = 0.01%)
- `calculateInterest(principalWei, annualRateBps, days)`: Calculate interest

#### Error Handling

- `handleEthErr(err)`: Handle Ethereum/smart contract errors, extract readable error messages
- `swalAlert`: Unified popup alerts (success, error, warning)

#### Time Processing

- `justExpiryTime(expiryTime)`: Check if not yet expired (returns true if not expired)

### Workflows

#### Create Note Workflow

1. User clicks "Create Note" button
2. Fill in form (target amount, interest rate, borrowing days)
3. Submit transaction, call `createNote` contract method
4. Wait for transaction confirmation
5. Note created successfully with `INIT` status

#### Review Note Workflow

1. Auditor clicks "Review" button on note card
2. Upload PDF contract file (required)
3. Optionally upload privacy certificate file (will be encrypted)
4. If privacy certificate is uploaded, add public information (jsonData) as preview
5. System calls API to get verification UUID
6. User signs verification message with wallet
7. Upload files and signature to backend API
8. Backend returns contract hash, encrypted privacy certificate hash (if provided), and privacy credentials abridged hash (if jsonData provided)
9. Call `pendingNote` contract method with note ID, contract hash, encrypted privacy certificate hash, and privacy credentials abridged hash
10. Wait for transaction confirmation
11. Note status changes to `PENDING`

#### Invest Note Workflow

1. Investor clicks "Invest Note" on note with `PENDING` status
2. Risk disclosure statement dialog appears with three tabs:
   - Risk Statement: Risk disclosure statement
   - Contract: View contract PDF
   - Privacy Preview: View privacy certificate preview (public information from jsonData)
3. User must wait for 10-second countdown
4. Click "Accept risk" to confirm
5. Call `invest` contract method, send FIL equal to target amount
6. Wait for transaction confirmation
7. Note status changes to `ACTIVE`

#### Withdraw Funds Workflow

**Creator Withdraw Funding Amount:**

1. View funding amount in agreement details
2. Click "Withdrawal" button
3. Call protocol contract's `withdrawFundingAmount` method
4. Wait for transaction confirmation

**Investor Withdraw Principal and Interest:**

1. View note information in agreement details
2. Wait for note expiry (countdown ends)
3. Click "Withdrawal" button
4. Call protocol contract's `withdraw` method
5. Wait for transaction confirmation

## Development Guidelines

### Code Style

- Use TypeScript for type checking (strict mode)
- Follow ESLint rules
- Use Prettier for code formatting
- Use Composition API (`<script setup>`) for components
- Use `ref` and `reactive` for reactive state management
- Use `computed` for computed properties
- Use `watch` to watch state changes

### Component Development Standards

- Component files use PascalCase naming
- Props use TypeScript type definitions
- Use `defineExpose` to expose component methods
- Use slots to improve component reusability
- Comprehensive error handling with user-friendly messages

### Security Considerations

- **Input Validation**: All user inputs must be validated (form validation, type checking)
- **Permission Checks**: Check user permissions before operations (is auditor, is creator, etc.)
- **Error Handling**: Comprehensive error handling to avoid leaking sensitive information
- **Contract Interaction**: All contract interactions must have error handling and user confirmation
- **Amount Calculation**: Use BigNumber.js for big number arithmetic to avoid precision loss
- **Signature Security**: Clearly inform users of signature content before signing

### Performance Optimization

- Use `v-if` and `v-show` appropriately to control component rendering
- Use `computed` to cache calculation results
- Avoid complex calculations in templates
- Use `watch` appropriately to avoid unnecessary watching
- Use appropriate formats and sizes for images and videos

## FAQ

### How to connect a wallet?

1. Click the "Connect Wallet" button in the top right corner
2. Select a supported wallet from the dialog
3. Confirm connection in your wallet
4. After successful connection, address will be displayed in the top right

### How to create a note?

1. Ensure wallet is connected
2. Click "Create Note" button on home page
3. Fill in the form:
   - **Target Amount**: Target amount (FIL)
   - **Interest Rate (bps)**: Interest rate (basis points, e.g., 20 bps = 0.2%)
   - **Borrowing Days**: Borrowing days
4. Click "Create Note" to submit
5. Confirm transaction in wallet
6. Wait for transaction confirmation

### How to become an auditor?

Auditors are added by the contract owner through the smart contract. If you are the contract owner, you can add auditors by calling the contract's `addAuditor` method.

### How to review a note?

1. Ensure your address is an auditor
2. Click "Review" button on note card with `INIT` status
3. Upload PDF format contract file
4. System will automatically get verification message and request signature
5. Confirm signature in wallet
6. Wait for file upload and transaction confirmation

### How to invest in a note?

1. Ensure wallet is connected and has sufficient FIL
2. Click "Invest Note" on note card with `PENDING` status
3. Carefully read risk disclosure statement
4. Wait for 10-second countdown
5. Click "Accept risk" to confirm
6. Confirm transaction in wallet (amount equals note target amount)
7. Wait for transaction confirmation

### How to withdraw funds?

**Creator Withdraw Funding Amount:**

1. Click "Agreement details" on note with `ACTIVE` status
2. View "Funding amount"
3. Click "Withdrawal" button
4. Confirm transaction in wallet

**Investor Withdraw Principal and Interest:**

1. Click "Agreement details" on note with `ACTIVE` status
2. Wait for note expiry (countdown ends)
3. Click "Withdrawal" button
4. Confirm transaction in wallet

### What to do if transaction fails?

- Check if wallet has sufficient FIL (including gas fees)
- Check if network connection is normal
- View error message
- If error message is unclear, check transaction details in block explorer
- Common errors:
  - "insufficient funds": Insufficient balance
  - "user rejected": User rejected transaction
  - "execution reverted": Contract execution failed (may be status doesn't meet requirements)

### How to view transaction details?

In the transaction confirmation dialog, click "View on tx" button to open transaction details page in block explorer.

## Contributing

Issues are welcome!

### Submitting Issues

- Use clear, descriptive titles
- Provide detailed reproduction steps
- Include relevant error messages or screenshots
- Describe your environment (browser, wallet, etc.)

## License

MIT License

## Related Links

- [Quasar Framework Documentation](https://quasar.dev)
- [Vue 3 Documentation](https://vuejs.org)
- [Reown AppKit Documentation](https://docs.reown.com)
- [ethers.js Documentation](https://docs.ethers.org)
- [Filecoin Documentation](https://docs.filecoin.io)
- [Filecoin Calibration Testnet](https://calibration.filscan.io)

## Documentation

- [中文文档 (Chinese Documentation)](./README.zh-CN.md)
