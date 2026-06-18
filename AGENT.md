# SoftwareOS - AI-Powered Software Discovery Platform

## Project Overview
SoftwareOS is a Next.js application that helps users discover, compare, and learn about software tools. The platform includes AI-generated content, comparison features, and personalized recommendations.

## Database Architecture
- **Supabase Project**: mtjxngrugxabqiamwajp
- **Primary Table**: tools (178 rows)
- **Key Columns**: id, slug, name, description, tagline, category, pricing_data, best_for_tags, pros, cons, entity_type

## Development Roadmap

### Phase A: Tool Data Seeding ✅ COMPLETE
**Objective**: Automatically fill database with descriptions, pricing, tags, and pros/cons for 178 tools

**Status**: COMPLETE
- ✅ Created `scripts/seed-tools-data-local.js` - seeded 163 tools with real data
- ✅ Created `scripts/enhance-tool-descriptions.js` - generated 100-150 word descriptions for all 178 tools
- ✅ Fixed entity page display (`src/app/software/[slug]/page.tsx`)
  - Tagline displays in header
  - Full description shows in About section
  - Best-for tags read from database
  - Pricing data renders with tiers
- ✅ Created `scripts/update-descriptions.sql` - SQL UPDATE statements for Supabase

**Deliverables**:
- All 178 tools have 100-150 word descriptions
- All tools have 4-5 best_for_tags
- Entity page displays data correctly
- Smart fallbacks for tools with missing data

---

### Phase B: Entity Type Infrastructure 🔄 IN PROGRESS
**Objective**: Extend tools table to support multiple entity types (software, service, template, plugin)

**Status**: IN PROGRESS
- ✅ Created `scripts/phase-b-migration.sql` - Migration script
- ✅ Updated TypeScript types in `src/lib/types.ts` - Added entity_type field
- ⏳ **NEXT STEP**: User to run `phase-b-migration.sql` in Supabase SQL Editor

**Requirements**:
1. Add `entity_type` column to tools table (default: 'software')
2. Create check constraint for valid types: 'software', 'service', 'template', 'plugin'
3. Add index on entity_type for query performance
4. Update all existing rows to entity_type = 'software'

**Migration Steps**:
1. Go to https://supabase.com/dashboard/project/mtjxngrugxabqiamwajp
2. Click **SQL Editor** in left sidebar
3. Create new query
4. Copy entire contents of `scripts/phase-b-migration.sql`
5. Run the query
6. Verify: Check tools table schema has entity_type column

---

### Phase C: Bulk Data Importer (Planned)
**Objective**: Allow bulk importing of entities from CSV/JSON

**Status**: NOT STARTED
- Create import API route
- Validate bulk data
- Handle type mapping
- Generate slugs
- Log import results

---

### Phase D: Advanced Filtering (Planned)
**Objective**: Add filtering by entity_type and multiple categories

**Status**: NOT STARTED
- Update compare page to filter by entity_type
- Create advanced search interface
- Optimize queries with new indexes

---

## Key Scripts

### Data Seeding
- `scripts/seed-tools-data-local.js` - Initial seed with hardcoded data for popular tools
- `scripts/enhance-tool-descriptions.js` - Smart description + tag generation
- `scripts/generate-update-sql.js` - Generate SQL UPDATE statements
- `scripts/update-descriptions.sql` - SQL file ready to run in Supabase

### Database Migrations
- `scripts/phase-b-migration.sql` - Add entity_type column and constraints

## API Keys & Credentials
- **Supabase URL**: https://mtjxngrugxabqiamwajp.supabase.co
- **Anon Key**: (stored in .env.local, read-only for REST API)
- **Service Role Key**: (needed for admin operations like migrations)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run seed scripts
node scripts/seed-tools-data-local.js
node scripts/enhance-tool-descriptions.js
node scripts/generate-update-sql.js
```

## Next Steps (Phase B Completion)
1. User runs `phase-b-migration.sql` in Supabase SQL Editor
2. Verify migration success
3. Deploy code changes
4. Begin Phase C planning

## Notes
- Anon key is read-only for REST API - SQL mutations must be run via Supabase dashboard
- Entity pages located at `/software/[slug]`
- Comparison page at `/compare`
- All tool data cached in Supabase (no external API dependency after Phase A)
