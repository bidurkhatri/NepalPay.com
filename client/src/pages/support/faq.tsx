import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SupportFAQPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about NepaliPay</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account" id="account">Account</TabsTrigger>
          <TabsTrigger value="payments" id="payments">Payments</TabsTrigger>
          <TabsTrigger value="blockchain" id="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="loans" id="loans">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Questions</CardTitle>
              <CardDescription>Basic information about NepaliPay</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is NepaliPay?</AccordionTrigger>
                  <AccordionContent>
                    NepaliPay is a blockchain-powered digital wallet application designed specifically for the Nepali financial ecosystem. It combines advanced blockchain technology with an intuitive user experience to provide secure, efficient, and accessible financial services to users in Nepal.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How is NepaliPay different from traditional payment apps?</AccordionTrigger>
                  <AccordionContent>
                    NepaliPay differs from traditional payment apps by using blockchain technology to provide secure, transparent, and immutable transactions. All transactions are recorded on the Binance Smart Chain, offering enhanced security and eliminating the need for traditional banking intermediaries. Additionally, NepaliPay offers NPT tokens, a stablecoin pegged to the Nepalese Rupee (NPR), enabling faster cross-border transactions with minimal fees.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Is NepaliPay available on both Android and iOS?</AccordionTrigger>
                  <AccordionContent>
                    Yes, NepaliPay is available as a web application and is fully responsive for mobile devices. Native mobile applications for both Android and iOS are in development and will be released soon.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Is there a fee to use NepaliPay?</AccordionTrigger>
                  <AccordionContent>
                    Basic account features like sending and receiving NPT tokens within the NepaliPay ecosystem have minimal fees. For blockchain transactions, there is a small gas fee charged by the Binance Smart Chain network. When purchasing NPT tokens using credit/debit cards through Stripe, a 2% service fee is applied in addition to the token cost and gas fees.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How secure is NepaliPay?</AccordionTrigger>
                  <AccordionContent>
                    NepaliPay employs industry-leading security measures including encrypted communications, secure password storage with strong hashing, two-factor authentication, and blockchain-based transaction verification. All smart contracts have been audited and deployed on the Binance Smart Chain for enhanced security.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Questions about registering, logging in, and managing your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="account-1">
                  <AccordionTrigger>How do I create a NepaliPay account?</AccordionTrigger>
                  <AccordionContent>
                    To create a NepaliPay account, click on the &quot;Sign Up&quot; button on the homepage. You&apos;ll need to provide your name, email address, create a strong password, and agree to the terms of service. After submitting, verify your email address through the verification link sent to your email.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-2">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    On the login page, click &quot;Forgot Password.&quot; Enter the email address associated with your account, and we&apos;ll send you a password reset link. Click the link in your email and follow the instructions to create a new password.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-3">
                  <AccordionTrigger>How do I update my personal information?</AccordionTrigger>
                  <AccordionContent>
                    Log in to your account, navigate to the &quot;Settings&quot; section from your dashboard, and select &quot;Profile.&quot; Here you can update your personal information including name, email, and contact details. Remember to save your changes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-4">
                  <AccordionTrigger>How do I enable two-factor authentication?</AccordionTrigger>
                  <AccordionContent>
                    Go to &quot;Settings&quot; {'->'} &quot;Security&quot; and select &quot;Enable Two-Factor Authentication.&quot; You&apos;ll need to download an authenticator app like Google Authenticator or Authy, scan the QR code provided, and enter the verification code to complete setup.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-5">
                  <AccordionTrigger>What should I do if I suspect unauthorized access to my account?</AccordionTrigger>
                  <AccordionContent>
                    Immediately change your password, enable two-factor authentication if not already enabled, and contact our support team through the &quot;Contact Support&quot; section. Review your recent transactions and report any suspicious activity.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments &amp; Transfers</CardTitle>
              <CardDescription>Questions about sending money, buying tokens, and utility payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payments-1">
                  <AccordionTrigger>How do I send money to another NepaliPay user?</AccordionTrigger>
                  <AccordionContent>
                    From your dashboard, click on &quot;Send Money&quot; or use the quick action buttons. Enter the recipient&apos;s username or wallet address, specify the amount, add an optional note, and confirm the transaction. You&apos;ll receive a confirmation once the transaction is complete.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payments-2">
                  <AccordionTrigger>How do I buy NPT tokens using credit/debit card?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the &quot;Buy Tokens&quot; section from your dashboard. Enter the amount of NPT you wish to purchase, review the total cost (including token cost, gas fees, and service fee), and click &quot;Proceed to Payment.&quot; You&apos;ll be directed to a secure Stripe checkout page where you can enter your card details to complete the purchase.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payments-3">
                  <AccordionTrigger>How do I pay utility bills through NepaliPay?</AccordionTrigger>
                  <AccordionContent>
                    From your dashboard, select &quot;Electricity&quot; or other utility payment options from the quick actions. Enter your utility account number, the amount to pay, add any notes if needed, and confirm the payment. You&apos;ll receive a confirmation receipt that can be used as proof of payment.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payments-4">
                  <AccordionTrigger>What is the maximum amount I can transfer in a single transaction?</AccordionTrigger>
                  <AccordionContent>
                    The maximum transfer amount depends on your account verification level. Basic verified accounts can transfer up to 10,000 NPR worth of NPT tokens per transaction, with a daily limit of 50,000 NPR. Fully verified accounts have higher limits of 100,000 NPR per transaction and 500,000 NPR daily.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payments-5">
                  <AccordionTrigger>How long do transactions take to process?</AccordionTrigger>
                  <AccordionContent>
                    Transactions within the NepaliPay ecosystem are typically processed instantly. Blockchain transactions (sending NPT tokens to external wallets) usually complete within 15 seconds to 5 minutes, depending on the network congestion on the Binance Smart Chain.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain &amp; NPT Tokens</CardTitle>
              <CardDescription>Understanding the NPT ecosystem and blockchain functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="blockchain-1">
                  <AccordionTrigger>What is NPT token?</AccordionTrigger>
                  <AccordionContent>
                    NPT (NepaliPay Token) is a stablecoin cryptocurrency created by NepaliPay. It&apos;s pegged to the Nepalese Rupee (NPR) at a 1:1 ratio, meaning 1 NPT is always worth 1 NPR. The token is built on the Binance Smart Chain (BSC) blockchain platform, making it secure, transparent, and efficient for transactions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="blockchain-2">
                  <AccordionTrigger>How do I connect my external crypto wallet?</AccordionTrigger>
                  <AccordionContent>
                    From your dashboard, go to the &quot;Wallet&quot; section and click &quot;Connect Wallet.&quot; You can connect popular wallets like MetaMask, Trust Wallet, or any other BSC-compatible wallet. Follow the prompts to authorize the connection. Once connected, you can directly manage your NPT tokens and other BSC assets.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="blockchain-3">
                  <AccordionTrigger>What are gas fees and why do I need to pay them?</AccordionTrigger>
                  <AccordionContent>
                    Gas fees are small transaction fees paid to blockchain validators who process and secure transactions on the Binance Smart Chain. These fees compensate for the computational resources required to execute and validate your transactions. Gas fees are paid in BNB (Binance Coin) and vary based on network congestion.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="blockchain-4">
                  <AccordionTrigger>Can I use my NPT tokens outside of NepaliPay?</AccordionTrigger>
                  <AccordionContent>
                    Yes, NPT tokens are standard BEP-20 tokens on the Binance Smart Chain. You can transfer them to any compatible wallet or exchange that supports BSC tokens. They can be stored in wallets like MetaMask, Trust Wallet, or hardware wallets like Ledger that support BSC.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="blockchain-5">
                  <AccordionTrigger>How secure are my NPT tokens?</AccordionTrigger>
                  <AccordionContent>
                    NPT tokens inherit the strong security of the Binance Smart Chain blockchain. They are controlled by cryptographic private keys, making them highly secure. When using the NepaliPay application, we implement additional security measures including encrypted communications, secure key management, and regular security audits to protect your assets.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loans &amp; Collaterals</CardTitle>
              <CardDescription>Information about micro-loans and managing collaterals</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="loans-1">
                  <AccordionTrigger>How do I apply for a micro-loan on NepaliPay?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the &quot;Loans&quot; section from your dashboard and click &quot;Apply for Loan.&quot; Select the loan amount, duration, and purpose. You&apos;ll need to provide collateral in the form of cryptocurrency (BTC, ETH, or BNB). Review the terms, including interest rate and loan-to-value ratio, then confirm your application.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="loans-2">
                  <AccordionTrigger>What cryptocurrencies can I use as collateral?</AccordionTrigger>
                  <AccordionContent>
                    Currently, NepaliPay accepts BNB (Binance Coin), ETH (Ethereum), and BTC (Bitcoin) as collateral for loans. Each cryptocurrency has different loan-to-value (LTV) ratios: BNB at 70%, ETH at 65%, and BTC at 60%. This means you can borrow up to that percentage of your collateral&apos;s value.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="loans-3">
                  <AccordionTrigger>What happens if I cannot repay my loan on time?</AccordionTrigger>
                  <AccordionContent>
                    If you cannot repay your loan by the due date, there&apos;s a grace period of 72 hours during which you can still repay with an additional late fee. If the loan remains unpaid after the grace period, and if the value of your collateral falls below the liquidation threshold, your collateral may be partially or fully liquidated to cover the outstanding loan amount.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="loans-4">
                  <AccordionTrigger>How is the interest rate determined for loans?</AccordionTrigger>
                  <AccordionContent>
                    Interest rates are determined by several factors: the type of cryptocurrency used as collateral, the loan-to-value ratio, the loan duration, and current market conditions. Typically, rates range from 3% to 8% for loans up to 30 days. Lower LTV ratios and shorter durations generally result in lower interest rates.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="loans-5">
                  <AccordionTrigger>Can I pay off my loan early?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can repay your loan before the due date without any early repayment penalties. In fact, early repayment may result in paying less interest overall. To repay early, simply go to the &quot;Loans&quot; section, select the active loan, and click &quot;Repay Loan.&quot; You&apos;ll see the current payoff amount, which you can then pay to close the loan and release your collateral.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}