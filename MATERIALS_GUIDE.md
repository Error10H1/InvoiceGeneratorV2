# Material Profiles Guide

Material Profiles let you organize your frequently-used items, services, and products into **multiple named lists**. Each profile can contain **unlimited items** with pricing and optional images. Perfect for:
- Different service categories
- Client-specific pricing
- Seasonal products
- Quick invoicing workflows

## Getting Started

1. Click the **Materials** button (Package icon) in the top toolbar to open the **Material Profiles Manager**.
2. By default, you have a **"Default List"** profile containing your previously saved materials.

## Managing Profiles

### Create a New Profile
1. Click the **Create New** button (Plus icon +) next to the active profile dropdown.
2. Enter a name for your new list (e.g., "2024 Product Catalog").
3. The new profile is automatically selected and will be empty initially.

### Rename a Profile
1. Select the profile you want to rename from the dropdown.
2. Click the **Rename** button.
3. Enter the new name and confirm.

### Delete a Profile
1. Select the profile you want to remove.
2. Click the **Delete Profile** button (Trash icon).
3. **Warning**: This action cannot be undone. You cannot delete the last remaining profile.

## Managing Items

Once a profile is selected:
- **Add Item**: Click "Add Item" to insert a new blank row.
- **Edit Item**: Click directly on the Name or Price fields to edit them.
  - **Images**: Click the image thumbnail (or placeholder icon) to upload a product image.
- **Delete Item**: Hover over the row and click the Trash icon on the right.

## Import & Export (Sharing)

You can share your material lists with other users or back them up.

### Exporting (JSON)
1. Select the profile you want to export.
2. Click **Export JSON**.
3. A `.json` file (e.g., `Materials_WebServices.json`) will download to your computer.

### Importing (JSON)
1. Click **Import JSON**.
2. Select a valid material profile `.json` file.
3. The list will be imported as a **new profile**.

**Supported Formats:**
1. **Full Profile**: The JSON file you exported from this app.
2. **Simple List**: A plain list of items (good for importing from other tools).
   ```json
   [
     { "Item": "Design Service", "Price": 100 },
     { "Item": "Hosting", "Price": 20 }
   ]
   ```
   *Fields supported: `Item` (or `name`), `Price` (or `price`).*

## Using Materials in Invoices

When creating or editing an invoice:
1. Scroll to the Itemized List section.
2. Click the dropdown that says **"Add from [Profile Name]..."**.
3. Select an item to instantly add it to your invoice row.
4. To switch source lists, go back to the **Material Profiles Manager** and change the **Active Profile**.
