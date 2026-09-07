/**
 * Veritas AML - Slack Block Kit Notification Integration
 * Sends rich compliance cards to AML compliance channels with interactive approval buttons.
 */

export interface SlackAlertPayload {
  id: string;
  alert_type: string;
  customer_name: string;
  amount_pkr: number;
  channel: string;
  disposition: string;
  confidence: number;
  rationale: string;
  evidence_hash: string;
  model_used: string;
}

export function buildSlackBlockKit(alert: SlackAlertPayload) {
  const isHighRisk = alert.disposition === 'ESCALATE' || alert.confidence >= 80;
  const statusEmoji = isHighRisk ? '🚨' : '⚠️';

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${statusEmoji} Veritas AML Alert: ${alert.alert_type.replace(/_/g, ' ')}`,
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Case ID:*\n\`${alert.id}\``
          },
          {
            type: 'mrkdwn',
            text: `*Customer:*\n${alert.customer_name}`
          },
          {
            type: 'mrkdwn',
            text: `*Trigger Amount:*\n*PKR ${alert.amount_pkr.toLocaleString()}*`
          },
          {
            type: 'mrkdwn',
            text: `*Payment Rail:*\n${alert.channel}`
          },
          {
            type: 'mrkdwn',
            text: `*AI Disposition:*\n*${alert.disposition}* (${alert.confidence}%)`
          },
          {
            type: 'mrkdwn',
            text: `*Evaluator Engine:*\n\`${alert.model_used}\``
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Investigative Rationale:*\n>${alert.rationale}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🔒 *Evidence SHA-256:* \`${alert.evidence_hash}\` | *Regulatory Tier:* Tier 1 (Human Signoff Required)`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: `Approve ${alert.disposition}`,
              emoji: true
            },
            style: alert.disposition === 'CLEAR' ? 'primary' : 'danger',
            value: `approve_${alert.id}`,
            action_id: `action_approve_${alert.id}`
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Open Dossier in Veritas',
              emoji: true
            },
            url: `https://veritas-aml.internal/cases/${alert.id}`,
            action_id: `action_open_${alert.id}`
          }
        ]
      }
    ]
  };
}

export async function sendSlackAlert(alert: SlackAlertPayload): Promise<{ success: boolean; channel?: string; error?: string }> {
  const botToken = process.env.SLACK_BOT_TOKEN;
  const channelId = process.env.SLACK_CHANNEL_ID || process.env.SLACK_CHANNEL;
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const blocks = buildSlackBlockKit(alert);

  // Method 1: Webhook URL
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blocks)
      });
      if (!resp.ok) {
        throw new Error(`Slack Webhook HTTP ${resp.status}`);
      }
      return { success: true, channel: 'webhook' };
    } catch (err: any) {
      console.error('[Slack Webhook Dispatch Failed]', err.message);
      return { success: false, error: err.message };
    }
  }

  // Method 2: Bot Token + Channel ID
  if (botToken && channelId) {
    try {
      const resp = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${botToken}`
        },
        body: JSON.stringify({
          channel: channelId,
          ...blocks,
          text: `Veritas AML Alert: ${alert.alert_type} for ${alert.customer_name}`
        })
      });
      const data = await resp.json();
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }
      return { success: true, channel: channelId };
    } catch (err: any) {
      console.error('[Slack Bot Token Dispatch Failed]', err.message);
      return { success: false, error: err.message };
    }
  }

  // Demo fallback / unconfigured state
  console.log(`[Slack Notification Ready] Case ${alert.id} formatted for Slack Block Kit. Set SLACK_BOT_TOKEN & SLACK_CHANNEL_ID or SLACK_WEBHOOK_URL to dispatch live.`);
  return { success: true, channel: 'simulated_slack_block_kit' };
}
