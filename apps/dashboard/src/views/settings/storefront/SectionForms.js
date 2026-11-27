// One form and one small preview per home page section type. The sections themselves are fixed:
// these forms change their content only.

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { CollectionSelect, ImageField, LinkField, ListEditor, useAssetUrl } from './common'
import { applyUpdate, fieldSetter } from './state'

// ── Field helpers ──

const Text = ({ label, value, onChange, required = false, multiline = false, helperText, max }) => (
  <TextField
    fullWidth
    size='small'
    label={label}
    value={value ?? ''}
    required={required}
    multiline={multiline}
    minRows={multiline ? 3 : undefined}
    inputProps={max ? { maxLength: max } : undefined}
    helperText={helperText}
    onChange={e => onChange(e.target.value)}
  />
)

// Updates go through updater functions so a late change (a slow upload) only touches its own field.
const set = (data, onChange, key) => fieldSetter(onChange, key)

// "home-decor-luxury" → "Home decor luxury", for summaries.
const slugWords = slug => {
  const words = (slug || '').replace(/-/g, ' ')

  return words.charAt(0).toUpperCase() + words.slice(1)
}

const slugFromHref = href => (href || '').split('/').filter(Boolean).pop() || ''

// ── Previews: small, true-to-life sketches of how each section reads on the shop ──

const PreviewFrame = ({ children, label = 'Preview' }) => (
  <Box sx={{ maxWidth: 640 }}>
    <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
      {label}
    </Typography>
    <Box
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        border: theme => `1px solid ${theme.palette.divider}`,
        bgcolor: '#fff'
      }}
    >
      {children}
    </Box>
  </Box>
)

const HeroPreview = ({ data }) => {
  const asset = useAssetUrl()
  const slide = data.slides?.[0]
  if (!slide) return null

  return (
    <PreviewFrame label='Preview of the first slide'>
      <Box sx={{ position: 'relative', aspectRatio: '16 / 7', bgcolor: '#e9e9e9' }}>
        {slide.image ? (
          <Box
            component='img'
            src={asset(slide.image)}
            alt=''
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0) 65%)'
          }}
        />
        <Box sx={{ position: 'absolute', left: '7%', top: '50%', transform: 'translateY(-50%)', color: '#fff' }}>
          <Typography sx={{ color: '#fff', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {slide.label}
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: 28, fontWeight: 500, lineHeight: 1.15, my: 1 }}>
            {slide.heading}
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              mt: 1,
              px: 2.5,
              py: 0.75,
              borderRadius: 4,
              bgcolor: '#fff',
              color: '#111',
              fontSize: 10,
              fontWeight: 500,
              textTransform: 'uppercase'
            }}
          >
            {slide.ctaLabel}
          </Box>
        </Box>
      </Box>
    </PreviewFrame>
  )
}

const AnnouncementPreview = ({ data }) => (
  <PreviewFrame>
    <Box
      sx={{
        bgcolor: '#111',
        color: '#fff',
        py: 1,
        px: 3,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {(data.messages || []).filter(Boolean).join('   ·   ')}
    </Box>
  </PreviewFrame>
)

const TilesPreview = ({ data }) => {
  const asset = useAssetUrl()

  return (
    <PreviewFrame>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, p: 1 }}>
        {(data.tiles || []).map((tile, i) => (
          <Box
            key={i}
            sx={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: 0.5, overflow: 'hidden', bgcolor: '#eee' }}
          >
            {tile.image ? (
              <Box
                component='img'
                src={asset(tile.image)}
                alt=''
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
            <Typography
              sx={{
                position: 'absolute',
                left: 4,
                bottom: 4,
                right: 4,
                color: '#fff',
                fontSize: 9,
                fontWeight: 500,
                textShadow: '0 1px 2px rgba(0,0,0,.5)'
              }}
            >
              {tile.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </PreviewFrame>
  )
}

const ShowcasePreview = ({ data }) => {
  const asset = useAssetUrl()

  return (
    <PreviewFrame>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: 120 }}>
        <Box sx={{ position: 'relative', bgcolor: '#eee' }}>
          {data.bannerImage ? (
            <Box
              component='img'
              src={asset(data.bannerImage)}
              alt=''
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
          <Typography
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 10,
              color: '#fff',
              fontSize: 18,
              fontWeight: 500,
              textShadow: '0 1px 3px rgba(0,0,0,.4)'
            }}
          >
            {data.heading}
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#111', mb: 1 }}>{data.categoryTitle}</Typography>
          {(data.categoryNav || []).slice(0, 6).map((l, i) => (
            <Typography key={i} sx={{ fontSize: 10, color: i === 0 ? '#111' : '#777', lineHeight: 1.8 }}>
              {l.label}
            </Typography>
          ))}
        </Box>
      </Box>
    </PreviewFrame>
  )
}

const BADGE_ICONS = {
  truck: { label: 'Delivery truck', icon: 'mdi:truck-outline' },
  'shield-check': { label: 'Shield with tick', icon: 'mdi:shield-check-outline' },
  award: { label: 'Award ribbon', icon: 'mdi:medal-outline' },
  'badge-check': { label: 'Badge with tick', icon: 'mdi:check-decagram-outline' },
  star: { label: 'Star', icon: 'mdi:star-outline' }
}

const BadgesPreview = ({ data }) => (
  <PreviewFrame>
    <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 2.5, px: 2, gap: 2 }}>
      {(data.items || []).map((item, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#111' }}>
          <Icon icon={BADGE_ICONS[item.icon]?.icon || 'mdi:circle-outline'} fontSize='1.125rem' />
          <Typography sx={{ fontSize: 11, color: '#111' }}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  </PreviewFrame>
)

// ── Forms ──

const HeroForm = ({ data, onChange }) => (
  <Box sx={{ display: 'grid', gap: 5 }}>
    <HeroPreview data={data} />
    <ListEditor
      items={data.slides || []}
      itemLabel='Slide'
      addLabel='Add slide'
      min={1}
      max={8}
      newItem={() => ({ image: '', label: '', heading: '', ctaLabel: 'Shop Now', ctaHref: '/collections/new-in' })}
      onChange={set(data, onChange, 'slides')}
      renderItem={(slide, update) => (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ImageField
              label='Slide image'
              value={slide.image}
              onChange={v => update(prev => ({ ...prev, image: v }))}
              ratio='16 / 7'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Text
              label='Small line above the heading'
              required
              max={60}
              value={slide.label}
              onChange={v => update(prev => ({ ...prev, label: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Text
              label='Heading'
              required
              max={60}
              value={slide.heading}
              onChange={v => update(prev => ({ ...prev, heading: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Text
              label='Button text'
              required
              max={30}
              value={slide.ctaLabel}
              onChange={v => update(prev => ({ ...prev, ctaLabel: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LinkField
              label='Button link'
              value={slide.ctaHref}
              onChange={v => update(prev => ({ ...prev, ctaHref: v }))}
            />
          </Grid>
        </Grid>
      )}
    />
  </Box>
)

const AnnouncementForm = ({ data, onChange }) => (
  <Box sx={{ display: 'grid', gap: 5 }}>
    <AnnouncementPreview data={data} />
    <ListEditor
      items={data.messages || []}
      itemLabel='Message'
      addLabel='Add message'
      min={1}
      max={10}
      newItem={() => ''}
      onChange={set(data, onChange, 'messages')}
      renderItem={(message, update) => (
        <Text
          label='Message'
          required
          max={120}
          value={message}
          onChange={update}
          helperText='Shown in capitals on the shop'
        />
      )}
    />
  </Box>
)

const TilesForm = ({ data, onChange }) => (
  <Box sx={{ display: 'grid', gap: 5 }}>
    <TilesPreview data={data} />
    <ListEditor
      items={data.tiles || []}
      itemLabel='Tile'
      addLabel='Add tile'
      min={1}
      max={12}
      newItem={() => ({ label: '', href: '/collections/', image: '', ctaLabel: 'Shop Now' })}
      onChange={tiles =>
        onChange(prev => ({ ...prev, variant: 'category_grid', tiles: applyUpdate(prev.tiles, tiles) }))
      }
      renderItem={(tile, update) => (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ImageField
              label='Tile image'
              value={tile.image}
              onChange={v => update(prev => ({ ...prev, image: v }))}
              ratio='3 / 4'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Text
              label='Title'
              required
              max={60}
              value={tile.label}
              onChange={v => update(prev => ({ ...prev, label: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LinkField label='Link' value={tile.href} onChange={v => update(prev => ({ ...prev, href: v }))} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Text
              label='Button text'
              required
              max={30}
              value={tile.ctaLabel}
              onChange={v => update(prev => ({ ...prev, ctaLabel: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Text
              label='Badge (optional)'
              max={12}
              value={tile.badge}
              onChange={v => update(prev => ({ ...prev, badge: v }))}
              helperText='For example 30%*'
            />
          </Grid>
        </Grid>
      )}
    />
  </Box>
)

const ShowcaseForm = ({ data, onChange }) => (
  <Box sx={{ display: 'grid', gap: 5 }}>
    <ShowcasePreview data={data} />
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ImageField
          label='Banner image'
          value={data.bannerImage}
          onChange={set(data, onChange, 'bannerImage')}
          ratio='4 / 3'
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Text label='Banner heading' required max={60} value={data.heading} onChange={set(data, onChange, 'heading')} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Text
          label='List heading'
          required
          max={60}
          value={data.categoryTitle}
          onChange={set(data, onChange, 'categoryTitle')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Text
          label='Button text (optional)'
          max={30}
          value={data.ctaLabel}
          onChange={set(data, onChange, 'ctaLabel')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LinkField label='Button link' value={data.ctaHref} onChange={set(data, onChange, 'ctaHref')} />
      </Grid>
      <Grid item xs={12}>
        <CollectionSelect
          label='Products shown first'
          value={data.collectionSlug}
          onChange={set(data, onChange, 'collectionSlug')}
          helperText='An empty collection shows the New in products instead'
        />
      </Grid>
    </Grid>
    <Box>
      <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
        Collections in the list
      </Typography>
      <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
        Each one becomes a tab that shows that collection's products
      </Typography>
      <ListEditor
        items={data.categoryNav || []}
        itemLabel='Collection'
        addLabel='Add collection'
        max={10}
        newItem={() => ({ label: '', href: '' })}
        onChange={set(data, onChange, 'categoryNav')}
        renderItem={(link, update) => (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Text
                label='Name in the list'
                required
                max={60}
                value={link.label}
                onChange={v => update(prev => ({ ...prev, label: v }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CollectionSelect
                label='Collection'
                value={slugFromHref(link.href)}
                onChange={slug => update(prev => ({ ...prev, href: `/collections/${slug}` }))}
              />
            </Grid>
          </Grid>
        )}
      />
    </Box>
  </Box>
)

const ProductGridForm = ({ data, onChange }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <Text
        label='Heading (optional)'
        max={80}
        value={data.title}
        onChange={set(data, onChange, 'title')}
        helperText='Leave empty to show "Products"'
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Text
        label='Text under the heading (optional)'
        max={200}
        value={data.subtitle}
        onChange={set(data, onChange, 'subtitle')}
      />
    </Grid>
    <Grid item xs={12}>
      <CollectionSelect
        label='Products from'
        value={data.collectionSlug}
        onChange={set(data, onChange, 'collectionSlug')}
        helperText='Shows up to 8 products'
      />
    </Grid>
  </Grid>
)

const TabsForm = ({ data, onChange }) => (
  <ListEditor
    items={data.tabs || []}
    itemLabel='Tab'
    addLabel='Add tab'
    min={1}
    max={6}
    newItem={() => ({ label: '', collectionSlug: 'new-in' })}
    onChange={set(data, onChange, 'tabs')}
    renderItem={(tab, update) => (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <Text
            label='Tab name'
            required
            max={30}
            value={tab.label}
            onChange={v => update(prev => ({ ...prev, label: v }))}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <CollectionSelect
            label='Products from'
            value={tab.collectionSlug}
            onChange={v => update(prev => ({ ...prev, collectionSlug: v }))}
          />
        </Grid>
      </Grid>
    )}
  />
)

const VideoForm = ({ data, onChange }) => {
  const cta = data.cta || { label: '', href: '' }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ImageField
          label='Image shown before the video plays'
          value={data.posterSrc}
          onChange={set(data, onChange, 'posterSrc')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LinkField
          label='Video file'
          value={data.videoSrc}
          onChange={set(data, onChange, 'videoSrc')}
          helperText='For example /videos/showcase.mp4'
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LinkField
          label='Video for phones (optional)'
          required={false}
          value={data.videoSrcMobile}
          onChange={set(data, onChange, 'videoSrcMobile')}
          helperText='Leave empty to use the same video'
        />
      </Grid>
      <Grid item xs={12}>
        <Text label='Heading (optional)' max={80} value={data.heading} onChange={set(data, onChange, 'heading')} />
      </Grid>
      <Grid item xs={12}>
        <Text
          label='Text (optional)'
          multiline
          max={300}
          value={data.description}
          onChange={set(data, onChange, 'description')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Text
          label='Button text (optional)'
          max={30}
          value={cta.label}
          onChange={v => onChange(prev => ({ ...prev, cta: { ...(prev.cta || {}), label: v } }))}
          helperText='Leave both button fields empty to hide the button'
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LinkField
          label='Button link'
          required={Boolean(cta.label)}
          value={cta.href}
          onChange={v => onChange(prev => ({ ...prev, cta: { ...(prev.cta || {}), href: v } }))}
        />
      </Grid>
    </Grid>
  )
}

const BadgesForm = ({ data, onChange }) => (
  <Box sx={{ display: 'grid', gap: 5 }}>
    <BadgesPreview data={data} />
    <ListEditor
      items={data.items || []}
      itemLabel='Badge'
      addLabel='Add badge'
      min={1}
      max={6}
      newItem={() => ({ icon: 'star', label: '' })}
      onChange={set(data, onChange, 'items')}
      renderItem={(item, update) => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <TextField
              select
              fullWidth
              size='small'
              label='Icon'
              value={item.icon}
              onChange={e => update(prev => ({ ...prev, icon: e.target.value }))}
            >
              {Object.entries(BADGE_ICONS).map(([value, { label, icon }]) => (
                <MenuItem key={value} value={value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Icon icon={icon} fontSize='1.125rem' />
                    {label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Text
              label='Text'
              required
              max={40}
              value={item.label}
              onChange={v => update(prev => ({ ...prev, label: v }))}
            />
          </Grid>
        </Grid>
      )}
    />
  </Box>
)

const HeadingFields = ({ data, onChange, headingFallback }) => (
  <>
    <Grid item xs={12} sm={4}>
      <Text
        label='Small line above (optional)'
        max={40}
        value={data.eyebrow}
        onChange={set(data, onChange, 'eyebrow')}
      />
    </Grid>
    <Grid item xs={12} sm={8}>
      <Text
        label='Heading'
        required
        max={80}
        value={data.heading}
        onChange={set(data, onChange, 'heading')}
        helperText={headingFallback}
      />
    </Grid>
    <Grid item xs={12}>
      <Text
        label='Text under the heading (optional)'
        max={200}
        value={data.subtitle}
        onChange={set(data, onChange, 'subtitle')}
      />
    </Grid>
  </>
)

const ReviewsForm = ({ data, onChange }) => (
  <Box sx={{ display: 'grid', gap: 5 }}>
    <Grid container spacing={3}>
      <HeadingFields data={data} onChange={onChange} />
    </Grid>
    <ListEditor
      items={data.reviews || []}
      itemLabel='Review'
      addLabel='Add review'
      max={20}
      newItem={() => ({ name: '', location: '', rating: 5, quote: '' })}
      onChange={set(data, onChange, 'reviews')}
      renderItem={(review, update) => (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <Text
              label='Customer name'
              required
              max={60}
              value={review.name}
              onChange={v => update(prev => ({ ...prev, name: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Text
              label='City'
              required
              max={60}
              value={review.location}
              onChange={v => update(prev => ({ ...prev, location: v }))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size='small'
              label='Stars'
              value={review.rating}
              onChange={e => update(prev => ({ ...prev, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map(n => (
                <MenuItem key={n} value={n}>
                  {n} {n === 1 ? 'star' : 'stars'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Text
              label='What they said'
              required
              multiline
              max={400}
              value={review.quote}
              onChange={v => update(prev => ({ ...prev, quote: v }))}
            />
          </Grid>
        </Grid>
      )}
    />
  </Box>
)

const NewsletterForm = ({ data, onChange }) => (
  <Grid container spacing={3}>
    <HeadingFields data={data} onChange={onChange} />
    <Grid item xs={12} sm={6}>
      <Text
        label='Text inside the email box (optional)'
        max={60}
        value={data.placeholder}
        onChange={set(data, onChange, 'placeholder')}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Text label='Button text (optional)' max={30} value={data.ctaLabel} onChange={set(data, onChange, 'ctaLabel')} />
    </Grid>
  </Grid>
)

// ── Section catalogue ──

export const SECTIONS = {
  hero: {
    name: 'Top slideshow',
    summary: d => (d.slides || []).map(sl => sl.heading).join(', '),
    icon: 'mdi:image-multiple-outline',
    Form: HeroForm
  },
  announcement: {
    name: 'Announcement bar',
    summary: d => d.messages?.[0] || 'No messages',
    icon: 'mdi:bullhorn-outline',
    Form: AnnouncementForm
  },
  banner: {
    name: 'Category tiles',
    summary: d => `${d.tiles?.length || 0} tiles`,
    icon: 'mdi:view-grid-outline',
    Form: TilesForm
  },
  category_showcase: {
    name: 'Category showcase',
    summary: d => `${slugWords(d.collectionSlug)} products · ${(d.categoryNav || []).length} collections in the list`,
    icon: 'mdi:view-split-vertical',
    Form: ShowcaseForm
  },
  product_grid: {
    name: 'Product grid',
    summary: d => d.title || `${slugWords(d.collectionSlug)} products`,
    icon: 'mdi:shopping-outline',
    Form: ProductGridForm
  },
  collection_tabs: {
    name: 'Product tabs',
    summary: d => (d.tabs || []).map(t => t.label).join(', '),
    icon: 'mdi:tab',
    Form: TabsForm
  },
  video_showcase: { name: 'Video', summary: d => d.heading || 'Video', icon: 'mdi:play-box-outline', Form: VideoForm },
  trust_badges: {
    name: 'Trust badges',
    summary: d => (d.items || []).map(i => i.label).join(', '),
    icon: 'mdi:shield-check-outline',
    Form: BadgesForm
  },
  customer_reviews: {
    name: 'Customer reviews',
    summary: d => `${d.reviews?.length || 0} reviews`,
    icon: 'mdi:comment-quote-outline',
    Form: ReviewsForm
  },
  newsletter: {
    name: 'Newsletter sign-up',
    summary: d => d.heading || '',
    icon: 'mdi:email-outline',
    Form: NewsletterForm
  }
}
