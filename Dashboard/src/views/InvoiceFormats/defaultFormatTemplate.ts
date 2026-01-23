// Default Invoice Format Template
// This matches the invoice design shown in the image

export const DEFAULT_INVOICE_FORMAT = {
  name: "Default Invoice Format",
  description: "Standard invoice format with company header, itemized list, and footer",
  isDefault: true,
  headerTemplate: `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
      <div style="flex: 1;">
        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">{{billDate}} {{billTime}}</div>
        <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">INVOICE</div>
      </div>
      <div style="text-align: right; flex: 1;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">{{storeName}}</div>
        <div style="font-size: 12px; color: #666;">Invoice #{{billNumber}}</div>
        <div style="font-size: 12px; color: #666;">Date: {{invoiceDate}}</div>
      </div>
    </div>
  `,
  template: `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <!-- Company Information -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">{{storeName}}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.6;">
          <div>{{storeAddress}}</div>
          <div>Phone: {{storePhone}}</div>
          <div>Email: {{storeEmail}}</div>
          <div>Website: {{storeWebsite}}</div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Bill To:</div>
        <div style="font-size: 12px; color: #666;">
          <div>{{customerName}}</div>
          {{#if customerEmail}}<div>{{customerEmail}}</div>{{/if}}
          {{#if customerPhone}}<div>{{customerPhone}}</div>{{/if}}
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <div>
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Number</div>
          <div style="font-size: 14px; font-weight: bold;">{{billNumber}}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Date</div>
          <div style="font-size: 14px; font-weight: bold;">{{invoiceDate}}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Status</div>
          <div style="font-size: 14px; font-weight: bold; color: #10b981;">{{status}}</div>
        </div>
      </div>

      <!-- Products Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #2563eb; color: white;">
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">ITEM</th>
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">SIZE</th>
            <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">QUANTITY</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">UNIT PRICE</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {{#each products}}
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                {{#if photo}}
                <img src="{{photo}}" alt="{{name}}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;">
                {{else}}
                <span style="font-size: 16px;">📄</span>
                {{/if}}
                <span>{{name}}</span>
              </div>
            </td>
            <td style="padding: 12px; font-size: 12px; color: #666;">{{size}}</td>
            <td style="padding: 12px; font-size: 12px; text-align: center;">{{quantity}}</td>
            <td style="padding: 12px; font-size: 12px; text-align: right;">₹{{price}}</td>
            <td style="padding: 12px; font-size: 12px; text-align: right; font-weight: bold;">₹{{total}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>

      <!-- Summary Section -->
      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #666;">Subtotal:</span>
          <span style="font-size: 14px; font-weight: bold;">₹{{subtotal}}</span>
        </div>
        {{#if discount}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #666;">Discount ({{discountPercent}}%):</span>
          <span style="font-size: 14px; color: #ef4444;">-₹{{discount}}</span>
        </div>
        {{/if}}
        {{#if tax}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #666;">Tax ({{taxPercent}}%):</span>
          <span style="font-size: 14px; font-weight: bold;">₹{{tax}}</span>
        </div>
        {{/if}}
        <div style="border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between;">
          <span style="font-size: 18px; font-weight: bold; color: #2563eb;">Total:</span>
          <span style="font-size: 18px; font-weight: bold; color: #2563eb;">₹{{total}}</span>
        </div>
      </div>
    </div>
  `,
  footerTemplate: `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Thank you for your business!</div>
      <div style="font-size: 12px; color: #666;">This is a computer-generated invoice and does not require a signature.</div>
      {{#if notes}}
      <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666;">
        <strong>Notes:</strong> {{notes}}
      </div>
      {{/if}}
    </div>
  `
};

// Simplified version using basic template variables (for backend rendering)
export const DEFAULT_INVOICE_FORMAT_SIMPLE = {
  name: "Default Invoice Format",
  description: "Standard invoice format with company header, itemized list, and footer",
  isDefault: true,
  headerTemplate: `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
      <div style="flex: 1;">
        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">{{billDate}}</div>
        <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">INVOICE</div>
      </div>
      <div style="text-align: right; flex: 1;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">{{storeName}}</div>
        <div style="font-size: 12px; color: #666;">Invoice #{{billNumber}}</div>
        <div style="font-size: 12px; color: #666;">Date: {{invoiceDate}}</div>
      </div>
    </div>
  `,
  template: `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <!-- Company Information -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">{{storeName}}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.6;">
          <div>{{storeAddress}}</div>
          <div>Phone: {{storePhone}}</div>
          <div>Email: {{storeEmail}}</div>
          <div>Website: {{storeWebsite}}</div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Bill To:</div>
        <div style="font-size: 12px; color: #666;">
          <div>{{customerName}}</div>
          <div>{{customerEmail}}</div>
          <div>{{customerPhone}}</div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <div>
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Number</div>
          <div style="font-size: 14px; font-weight: bold;">{{billNumber}}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Invoice Date</div>
          <div style="font-size: 14px; font-weight: bold;">{{invoiceDate}}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Status</div>
          <div style="font-size: 14px; font-weight: bold; color: #10b981;">{{status}}</div>
        </div>
      </div>

      <!-- Products Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #2563eb; color: white;">
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">ITEM</th>
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">SIZE</th>
            <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">QUANTITY</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">UNIT PRICE</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {{products}}
        </tbody>
      </table>

      <!-- Summary Section -->
      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #666;">Subtotal:</span>
          <span style="font-size: 14px; font-weight: bold;">₹{{subtotal}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #666;">Discount ({{discountPercent}}%):</span>
          <span style="font-size: 14px; color: #ef4444;">-₹{{discount}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #666;">Tax ({{taxPercent}}%):</span>
          <span style="font-size: 14px; font-weight: bold;">₹{{tax}}</span>
        </div>
        <div style="border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between;">
          <span style="font-size: 18px; font-weight: bold; color: #2563eb;">Total:</span>
          <span style="font-size: 18px; font-weight: bold; color: #2563eb;">₹{{total}}</span>
        </div>
      </div>
    </div>
  `,
  footerTemplate: `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Thank you for your business!</div>
      <div style="font-size: 12px; color: #666;">This is a computer-generated invoice and does not require a signature.</div>
      <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666;">
        <strong>Notes:</strong> {{notes}}
      </div>
    </div>
  `
};

