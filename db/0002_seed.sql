-- ReviseWJEC seed data
-- Run AFTER 0001_init.sql in the Supabase SQL Editor.

-- ============================================================
-- ReviseWJEC — Full Seed File
-- Subjects + Topics (Maths 139 topics, Biology 5 units)
-- ============================================================

-- ── 1. Subjects ─────────────────────────────────────────────
INSERT INTO subjects (id, name, slug, description) VALUES
  ('maths-wjec-3300-u1', 'WJEC GCSE Maths 3300', 'maths',
   'Intermediate Unit 1 — Non-Calculator, 80 marks, 1 hour 45 minutes'),
  ('biology-wjec-gcse',  'WJEC GCSE Biology',    'biology',
   'WJEC GCSE Biology — 5 units')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Maths Topics ─────────────────────────────────────────
INSERT INTO topics
  (id, subject_id, topic_number, name, domain, topic_group, priority, typical_marks)
VALUES
-- Number, Ratio & Proportion
('m-001', 'maths-wjec-3300-u1',   1, 'Prime Numbers and Factors',             'Number, Ratio & Proportion', '1.1 Calculation',              'CORE',     2),
('m-002', 'maths-wjec-3300-u1',   2, 'Multiplying and Dividing Decimals',     'Number, Ratio & Proportion', '1.1 Calculation',              'CORE',     1),
('m-003', 'maths-wjec-3300-u1',   3, 'Prime Factorisation',                   'Number, Ratio & Proportion', '1.1 Calculation',              'COMMON',   3),
('m-004', 'maths-wjec-3300-u1',   4, 'Converting Fractions and Decimals',     'Number, Ratio & Proportion', '1.2 Fractions, Decimals, %',   'COMMON',   3),
('m-005', 'maths-wjec-3300-u1',   5, 'Estimation and Approximation',          'Number, Ratio & Proportion', '1.3 Accuracy',                 'COMMON',   2),
('m-006', 'maths-wjec-3300-u1',   6, 'Powers and Roots (Integer)',            'Number, Ratio & Proportion', '1.1 Calculation',              'COMMON',   2),
('m-007', 'maths-wjec-3300-u1',   7, 'Reading and Writing Standard Form',     'Number, Ratio & Proportion', '1.1 Calculation',              'COMMON',   2),
('m-008', 'maths-wjec-3300-u1',   8, 'Calculating with Integer Indices',      'Number, Ratio & Proportion', '1.1 Calculation',              'COMMON',   2),
('m-009', 'maths-wjec-3300-u1',   9, 'Metric Conversions',                    'Number, Ratio & Proportion', '1.3 Accuracy',                 'COMMON',   1),
('m-010', 'maths-wjec-3300-u1',  10, 'Fractional Indices',                    'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 4),
('m-011', 'maths-wjec-3300-u1',  11, 'Sharing in a Ratio',                    'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 4),
('m-012', 'maths-wjec-3300-u1',  12, 'Percentage Change',                     'Number, Ratio & Proportion', '5.2 Percentages',              'MODERATE', 4),
('m-013', 'maths-wjec-3300-u1',  13, 'Rounding to Significant Figures',       'Number, Ratio & Proportion', '1.3 Accuracy',                 'MODERATE', 3),
('m-014', 'maths-wjec-3300-u1',  14, 'Order of Operations (BODMAS)',          'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 3),
('m-015', 'maths-wjec-3300-u1',  15, 'Highest Common Factor (HCF)',           'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 3),
('m-016', 'maths-wjec-3300-u1',  16, 'Systematic Listing',                    'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 3),
('m-017', 'maths-wjec-3300-u1',  17, 'Operations with Negative Numbers',      'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 3),
('m-018', 'maths-wjec-3300-u1',  18, 'Fractions in Ratio Problems',           'Number, Ratio & Proportion', '1.2 Fractions, Decimals, %',   'MODERATE', 3),
('m-019', 'maths-wjec-3300-u1',  19, 'Fractions/Percentages as Operators',    'Number, Ratio & Proportion', '1.2 Fractions, Decimals, %',   'MODERATE', 3),
('m-020', 'maths-wjec-3300-u1',  20, 'Mixed Number Operations',               'Number, Ratio & Proportion', '1.2 Fractions, Decimals, %',   'MODERATE', 3),
('m-021', 'maths-wjec-3300-u1',  21, 'Equivalent Ratios',                     'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 3),
('m-022', 'maths-wjec-3300-u1',  22, 'Ratio and Fraction Links',              'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 3),
('m-023', 'maths-wjec-3300-u1',  23, 'Three-Part Ratios',                     'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 3),
('m-024', 'maths-wjec-3300-u1',  24, 'Scale Factors',                         'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 3),
('m-025', 'maths-wjec-3300-u1',  25, 'Percentage Increase and Decrease',      'Number, Ratio & Proportion', '5.2 Percentages',              'MODERATE', 3),
('m-026', 'maths-wjec-3300-u1',  26, 'Direct Proportion',                     'Number, Ratio & Proportion', '5.3 Proportion',               'MODERATE', 3),
('m-027', 'maths-wjec-3300-u1',  27, 'Unitary Method',                        'Number, Ratio & Proportion', '5.3 Proportion',               'MODERATE', 3),
('m-028', 'maths-wjec-3300-u1',  28, 'Speed, Distance and Time',              'Number, Ratio & Proportion', '5.4 Rates / Speed',            'MODERATE', 3),
('m-029', 'maths-wjec-3300-u1',  29, 'Density, Mass and Volume',              'Number, Ratio & Proportion', '5.4 Rates / Speed',            'MODERATE', 3),
('m-030', 'maths-wjec-3300-u1',  30, 'Converting Units',                      'Number, Ratio & Proportion', '5.4 Rates / Speed',            'MODERATE', 3),
('m-031', 'maths-wjec-3300-u1',  31, 'Standard Units of Measure',             'Number, Ratio & Proportion', '1.3 Accuracy',                 'MODERATE', 2),
('m-032', 'maths-wjec-3300-u1',  32, 'Ordering Numbers',                      'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 2),
('m-033', 'maths-wjec-3300-u1',  33, 'Inverse Operations',                    'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 2),
('m-034', 'maths-wjec-3300-u1',  34, 'Lowest Common Multiple (LCM)',          'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 2),
('m-035', 'maths-wjec-3300-u1',  35, 'Adding and Subtracting Fractions',      'Number, Ratio & Proportion', '1.2 Fractions, Decimals, %',   'MODERATE', 2),
('m-036', 'maths-wjec-3300-u1',  36, 'Ratio Notation',                        'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 2),
('m-037', 'maths-wjec-3300-u1',  37, 'Simplifying Ratios',                    'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 2),
('m-038', 'maths-wjec-3300-u1',  38, 'Percentage of an Amount',               'Number, Ratio & Proportion', '5.2 Percentages',              'MODERATE', 2),
('m-039', 'maths-wjec-3300-u1',  39, 'Reverse Percentages',                   'Number, Ratio & Proportion', '5.2 Percentages',              'MODERATE', 2),
('m-040', 'maths-wjec-3300-u1',  40, 'Express as a Percentage',               'Number, Ratio & Proportion', '5.2 Percentages',              'MODERATE', 2),
('m-041', 'maths-wjec-3300-u1',  41, 'Addition and Subtraction of Integers',  'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 1),
('m-042', 'maths-wjec-3300-u1',  42, 'Adding and Subtracting Decimals',       'Number, Ratio & Proportion', '1.1 Calculation',              'MODERATE', 1),
('m-043', 'maths-wjec-3300-u1',  43, 'Multiplying and Dividing Fractions',    'Number, Ratio & Proportion', '1.2 Fractions, Decimals, %',   'MODERATE', 1),
('m-044', 'maths-wjec-3300-u1',  44, 'Ratio Problems',                        'Number, Ratio & Proportion', '5.1 Ratio',                    'MODERATE', 1),
('m-045', 'maths-wjec-3300-u1',  45, 'Upper and Lower Bounds',                'Number, Ratio & Proportion', '1.3 Accuracy',                 'MODERATE', 1),
('m-046', 'maths-wjec-3300-u1',  46, 'Working with Time',                     'Number, Ratio & Proportion', '1.3 Accuracy',                 'MODERATE', 1),
('m-047', 'maths-wjec-3300-u1',  47, 'Rounding to Decimal Places',            'Number, Ratio & Proportion', '1.3 Accuracy',                 'MODERATE', 1),
('m-048', 'maths-wjec-3300-u1',  48, 'Compound Interest and Depreciation',    'Number, Ratio & Proportion', '5.2 Percentages',              'MODERATE', 1),
-- Algebra
('m-049', 'maths-wjec-3300-u1',  49, 'Simultaneous Equations (Linear)',       'Algebra', '2.2 Equations',   'CORE',     5),
('m-050', 'maths-wjec-3300-u1',  50, 'Plotting Quadratic Graphs',             'Algebra', '2.4 Graphs',      'CORE',     2),
('m-051', 'maths-wjec-3300-u1',  51, 'Substitution',                          'Algebra', '2.1 Expressions', 'CORE',     2),
('m-052', 'maths-wjec-3300-u1',  52, 'Collecting Like Terms',                 'Algebra', '2.1 Expressions', 'CORE',     2),
('m-053', 'maths-wjec-3300-u1',  53, 'Solving Linear Inequalities',           'Algebra', '2.2 Equations',   'COMMON',   4),
('m-054', 'maths-wjec-3300-u1',  54, 'Solving Linear Equations (Multi-Step)', 'Algebra', '2.2 Equations',   'COMMON',   3),
('m-055', 'maths-wjec-3300-u1',  55, 'Forming Equations',                     'Algebra', '2.2 Equations',   'COMMON',   3),
('m-056', 'maths-wjec-3300-u1',  56, 'Solving Quadratics by Factorising',     'Algebra', '2.2 Equations',   'COMMON',   3),
('m-057', 'maths-wjec-3300-u1',  57, 'Expanding Single Brackets',             'Algebra', '2.1 Expressions', 'COMMON',   2),
('m-058', 'maths-wjec-3300-u1',  58, 'Term-to-Term Rules',                    'Algebra', '2.3 Sequences',   'COMMON',   2),
('m-059', 'maths-wjec-3300-u1',  59, 'Rearranging Formulae',                  'Algebra', '2.1 Expressions', 'COMMON',   2),
('m-060', 'maths-wjec-3300-u1',  60, 'Using Standard Formulae',               'Algebra', '2.1 Expressions', 'MODERATE', 5),
('m-061', 'maths-wjec-3300-u1',  61, 'Sketching Linear Functions',            'Algebra', '2.4 Graphs',      'MODERATE', 4),
('m-062', 'maths-wjec-3300-u1',  62, 'Features of Quadratic Graphs',          'Algebra', '2.4 Graphs',      'MODERATE', 4),
('m-063', 'maths-wjec-3300-u1',  63, 'Algebraic Fractions',                   'Algebra', '2.1 Expressions', 'MODERATE', 4),
('m-064', 'maths-wjec-3300-u1',  64, 'Equations with Unknown on Both Sides',  'Algebra', '2.2 Equations',   'MODERATE', 3),
('m-065', 'maths-wjec-3300-u1',  65, 'Coordinates in Four Quadrants',         'Algebra', '2.4 Graphs',      'MODERATE', 3),
('m-066', 'maths-wjec-3300-u1',  66, 'Special Number Sequences',              'Algebra', '2.3 Sequences',   'MODERATE', 3),
('m-067', 'maths-wjec-3300-u1',  67, 'Arithmetic Sequences',                  'Algebra', '2.3 Sequences',   'MODERATE', 3),
('m-068', 'maths-wjec-3300-u1',  68, 'Equations vs Identities',               'Algebra', '2.1 Expressions', 'MODERATE', 3),
('m-069', 'maths-wjec-3300-u1',  69, 'Finding Equation of a Line',            'Algebra', '2.4 Graphs',      'MODERATE', 2),
('m-070', 'maths-wjec-3300-u1',  70, 'Algebraic Notation',                    'Algebra', '2.1 Expressions', 'MODERATE', 2),
('m-071', 'maths-wjec-3300-u1',  71, 'Algebraic Vocabulary',                  'Algebra', '2.1 Expressions', 'MODERATE', 2),
('m-072', 'maths-wjec-3300-u1',  72, 'Factorising Single Brackets',           'Algebra', '2.1 Expressions', 'MODERATE', 2),
('m-073', 'maths-wjec-3300-u1',  73, 'nth Term of Linear Sequences',          'Algebra', '2.3 Sequences',   'MODERATE', 2),
('m-074', 'maths-wjec-3300-u1',  74, 'Solving Equations Graphically',         'Algebra', '2.2 Equations',   'MODERATE', 2),
('m-075', 'maths-wjec-3300-u1',  75, 'Expanding Double Brackets',             'Algebra', '2.1 Expressions', 'MODERATE', 2),
('m-076', 'maths-wjec-3300-u1',  76, 'One-Step Linear Equations',             'Algebra', '2.2 Equations',   'MODERATE', 1),
('m-077', 'maths-wjec-3300-u1',  77, 'Plotting Straight-Line Graphs',         'Algebra', '2.4 Graphs',      'MODERATE', 1),
('m-078', 'maths-wjec-3300-u1',  78, 'y = mx + c Form',                       'Algebra', '2.4 Graphs',      'MODERATE', 1),
('m-079', 'maths-wjec-3300-u1',  79, 'Gradient and Intercept',                'Algebra', '2.4 Graphs',      'MODERATE', 1),
('m-080', 'maths-wjec-3300-u1',  80, 'Parallel and Perpendicular Lines',      'Algebra', '2.4 Graphs',      'MODERATE', 1),
('m-081', 'maths-wjec-3300-u1',  81, 'Laws of Indices in Algebra',            'Algebra', '2.1 Expressions', 'MODERATE', 1),
('m-082', 'maths-wjec-3300-u1',  82, 'Position-to-Term Rules',                'Algebra', '2.3 Sequences',   'MODERATE', 1),
-- Geometry & Measures
('m-083', 'maths-wjec-3300-u1',  83, 'Volume of Prisms',                       'Geometry & Measures', '3.1 Mensuration',     'COMMON',   4),
('m-084', 'maths-wjec-3300-u1',  84, 'Geometric Problems Using Constructions', 'Geometry & Measures', '3.5 Constructions',   'COMMON',   3),
('m-085', 'maths-wjec-3300-u1',  85, 'Angles in Same Segment [H]',             'Geometry & Measures', '3.2 Angle Properties','COMMON',   3),
('m-086', 'maths-wjec-3300-u1',  86, 'Area of Rectangles and Triangles',       'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 7),
('m-087', 'maths-wjec-3300-u1',  87, 'Composite Areas',                        'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 6),
('m-088', 'maths-wjec-3300-u1',  88, 'Area of Trapezium',                      'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 5),
('m-089', 'maths-wjec-3300-u1',  89, 'Surface Area of Prisms',                 'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 4),
('m-090', 'maths-wjec-3300-u1',  90, 'Quadrilateral Properties',               'Geometry & Measures', '3.2 Angle Properties','MODERATE', 4),
('m-091', 'maths-wjec-3300-u1',  91, 'Pythagoras Theorem — Find Hypotenuse',   'Geometry & Measures', '3.3 Pythagoras / Trig','MODERATE', 4),
('m-092', 'maths-wjec-3300-u1',  92, 'Rotational Symmetry',                    'Geometry & Measures', '3.2 Angle Properties','MODERATE', 4),
('m-093', 'maths-wjec-3300-u1',  93, 'Angles in Parallel Lines',               'Geometry & Measures', '3.2 Angle Properties','MODERATE', 3),
('m-094', 'maths-wjec-3300-u1',  94, 'Triangle Properties',                    'Geometry & Measures', '3.2 Angle Properties','MODERATE', 3),
('m-095', 'maths-wjec-3300-u1',  95, 'Interior Angles of Polygons',            'Geometry & Measures', '3.2 Angle Properties','MODERATE', 3),
('m-096', 'maths-wjec-3300-u1',  96, 'Congruent Triangles',                    'Geometry & Measures', '3.2 Angle Properties','MODERATE', 3),
('m-097', 'maths-wjec-3300-u1',  97, 'Dimensional Analysis [H]',               'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 3),
('m-098', 'maths-wjec-3300-u1',  98, 'Arc Length and Sector Area',             'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 3),
('m-099', 'maths-wjec-3300-u1',  99, 'Perpendicular Bisector Construction',    'Geometry & Measures', '3.5 Constructions',   'MODERATE', 3),
('m-100', 'maths-wjec-3300-u1', 100, 'Loci',                                   'Geometry & Measures', '3.5 Constructions',   'MODERATE', 3),
('m-101', 'maths-wjec-3300-u1', 101, 'Scale Drawings and Maps',                'Geometry & Measures', '3.5 Constructions',   'MODERATE', 3),
('m-102', 'maths-wjec-3300-u1', 102, 'Isometric Drawing',                      'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 2),
('m-103', 'maths-wjec-3300-u1', 103, 'Perimeter',                              'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 2),
('m-104', 'maths-wjec-3300-u1', 104, 'Angle Notation',                         'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-105', 'maths-wjec-3300-u1', 105, 'Measuring Angles',                       'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-106', 'maths-wjec-3300-u1', 106, 'Angles at a Point and on a Line',        'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-107', 'maths-wjec-3300-u1', 107, 'Vertically Opposite Angles',             'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-108', 'maths-wjec-3300-u1', 108, 'Exterior Angles of Polygons',            'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-109', 'maths-wjec-3300-u1', 109, 'Similar Shapes',                         'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-110', 'maths-wjec-3300-u1', 110, 'Rotation',                               'Geometry & Measures', '3.4 Transformations', 'MODERATE', 2),
('m-111', 'maths-wjec-3300-u1', 111, 'Enlargement',                            'Geometry & Measures', '3.4 Transformations', 'MODERATE', 2),
('m-112', 'maths-wjec-3300-u1', 112, 'Describing Transformations',             'Geometry & Measures', '3.4 Transformations', 'MODERATE', 2),
('m-113', 'maths-wjec-3300-u1', 113, 'Combined Transformations [H]',           'Geometry & Measures', '3.4 Transformations', 'MODERATE', 2),
('m-114', 'maths-wjec-3300-u1', 114, 'Nets of 3D Shapes',                      'Geometry & Measures', '3.1 Mensuration',     'MODERATE', 2),
('m-115', 'maths-wjec-3300-u1', 115, 'Line Symmetry',                          'Geometry & Measures', '3.2 Angle Properties','MODERATE', 2),
('m-116', 'maths-wjec-3300-u1', 116, 'Finding a Side Using Trig',              'Geometry & Measures', '3.3 Pythagoras / Trig','MODERATE', 1),
('m-117', 'maths-wjec-3300-u1', 117, 'Reflection',                             'Geometry & Measures', '3.4 Transformations', 'MODERATE', 1),
('m-118', 'maths-wjec-3300-u1', 118, 'Bearings',                               'Geometry & Measures', '3.5 Constructions',   'MODERATE', 1),
('m-119', 'maths-wjec-3300-u1', 119, 'Translation',                            'Geometry & Measures', '3.4 Transformations', 'MODERATE', 1),
('m-120', 'maths-wjec-3300-u1', 120, '2D Shapes and their Properties',         'Geometry & Measures', '3.2 Angle Properties','MODERATE', 1),
('m-121', 'maths-wjec-3300-u1', 121, 'Pythagoras Theorem in Context',          'Geometry & Measures', '3.3 Pythagoras / Trig','MODERATE', 1),
-- Statistics & Probability
('m-122', 'maths-wjec-3300-u1', 122, 'Expected Frequency',                'Statistics & Probability', '4.1 Probability — Basic',    'CORE',     2),
('m-123', 'maths-wjec-3300-u1', 123, 'Mean',                              'Statistics & Probability', '6.1 Averages',               'COMMON',   3),
('m-124', 'maths-wjec-3300-u1', 124, 'Sample Space / Systematic Listing', 'Statistics & Probability', '4.2 Probability — Combined', 'COMMON',   2),
('m-125', 'maths-wjec-3300-u1', 125, 'Tree Diagrams',                     'Statistics & Probability', '4.2 Probability — Combined', 'COMMON',   2),
('m-126', 'maths-wjec-3300-u1', 126, 'Venn Diagrams (Probability)',       'Statistics & Probability', '4.2 Probability — Combined', 'COMMON',   2),
('m-127', 'maths-wjec-3300-u1', 127, 'Relative Frequency',                'Statistics & Probability', '4.1 Probability — Basic',    'MODERATE', 4),
('m-128', 'maths-wjec-3300-u1', 128, 'AND Rule',                          'Statistics & Probability', '4.2 Probability — Combined', 'MODERATE', 4),
('m-129', 'maths-wjec-3300-u1', 129, 'Pie Charts',                        'Statistics & Probability', '6.2 Data Handling',          'MODERATE', 4),
('m-130', 'maths-wjec-3300-u1', 130, 'Range',                             'Statistics & Probability', '6.1 Averages',               'MODERATE', 3),
('m-131', 'maths-wjec-3300-u1', 131, 'Averages from Grouped Data',        'Statistics & Probability', '6.1 Averages',               'MODERATE', 3),
('m-132', 'maths-wjec-3300-u1', 132, 'Probability of Single Events',      'Statistics & Probability', '4.1 Probability — Basic',    'MODERATE', 2),
('m-133', 'maths-wjec-3300-u1', 133, 'Relative Frequency (2)',            'Statistics & Probability', '4.1 Probability — Basic',    'MODERATE', 2),
('m-134', 'maths-wjec-3300-u1', 134, 'Median',                            'Statistics & Probability', '6.1 Averages',               'MODERATE', 2),
('m-135', 'maths-wjec-3300-u1', 135, 'Mode / Modal Class',                'Statistics & Probability', '6.1 Averages',               'MODERATE', 2),
('m-136', 'maths-wjec-3300-u1', 136, 'Frequency Tables',                  'Statistics & Probability', '6.2 Data Handling',          'MODERATE', 2),
('m-137', 'maths-wjec-3300-u1', 137, 'Two-Way Tables',                    'Statistics & Probability', '6.2 Data Handling',          'MODERATE', 2),
('m-138', 'maths-wjec-3300-u1', 138, 'Calculating Single Event Probability','Statistics & Probability','4.1 Probability — Basic',   'MODERATE', 1),
('m-139', 'maths-wjec-3300-u1', 139, 'Independent Events [H]',            'Statistics & Probability', '4.2 Probability — Combined', 'MODERATE', 1)
ON CONFLICT (id) DO NOTHING;

-- ── 3. Biology Topics ────────────────────────────────────────
INSERT INTO topics
  (id, subject_id, topic_number, name, domain, topic_group, priority, typical_marks)
VALUES
  ('b-001', 'biology-wjec-gcse', 1, 'Cells and Division',              'Cells and Division',              'Cell Biology', 'CORE', NULL),
  ('b-002', 'biology-wjec-gcse', 2, 'Disease Defence and Treatment',   'Disease Defence and Treatment',   'Health',       'CORE', NULL),
  ('b-003', 'biology-wjec-gcse', 3, 'Response and Regulation',         'Response and Regulation',         'Physiology',   'CORE', NULL),
  ('b-004', 'biology-wjec-gcse', 4, 'DNA and Inheritance',             'DNA and Inheritance',             'Genetics',     'CORE', NULL),
  ('b-005', 'biology-wjec-gcse', 5, 'Classification and Biodiversity', 'Classification and Biodiversity', 'Ecology',      'CORE', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Notes / Questions / Flashcards for the seeded CORE topics
-- ============================================================

-- Revision notes
INSERT INTO revision_notes (topic_id, content_markdown, spec_reference) VALUES
('m-001',
'# Prime Numbers and Factors

A **prime number** is a whole number greater than 1 with exactly two factors: 1 and itself.

- The first primes: **2, 3, 5, 7, 11, 13, 17, 19, 23**.
- **2** is the only even prime.
- A **factor** of a number divides it exactly with no remainder.

## Finding factors
List in pairs: factors of 18 → (1,18), (2,9), (3,6).

## Tip
Memorise primes up to 50. They appear constantly in non-calculator papers.',
'WJEC 3300 · 1.1 Calculation'),
('m-002',
'# Multiplying and Dividing Decimals

When **multiplying decimals**, multiply as if they were integers, then place the decimal so the answer has the same total number of decimal places as the inputs.

`0.4 × 0.3 = 0.12`  *(1 dp + 1 dp = 2 dp)*

When **dividing decimals**, multiply both numbers by a power of 10 to make the divisor whole.

`1.2 ÷ 0.4 = 12 ÷ 4 = 3`',
'WJEC 3300 · 1.1 Calculation'),
('m-049',
'# Simultaneous Equations (Linear)

Two equations, two unknowns. Solve by **elimination** or **substitution**.

## Elimination
1. Make the coefficient of one variable equal in both equations.
2. Add or subtract to eliminate it.
3. Solve for the remaining variable, then back-substitute.

**Example:** `2x + y = 7`, `x − y = 2`. Adding: `3x = 9`, so `x = 3`, `y = 1`.',
'WJEC 3300 · 2.2 Equations'),
('m-050',
'# Plotting Quadratic Graphs

A **quadratic** has form `y = ax² + bx + c`. Its graph is a **parabola**.

1. Build a table of values for chosen x.
2. Plot points carefully on the grid.
3. Join with a smooth curve — never straight lines.

The **turning point** is the minimum (a > 0) or maximum (a < 0).',
'WJEC 3300 · 2.4 Graphs'),
('m-051',
'# Substitution

Replace each letter with its given value, then evaluate using **BIDMAS**.

If `a = 3`, `b = −2`, then `2a − b² = 2(3) − (−2)² = 6 − 4 = 2`.

Watch the **sign** when squaring negatives: `(−2)² = 4`, not `−4`.',
'WJEC 3300 · 2.1 Expressions'),
('m-052',
'# Collecting Like Terms

**Like terms** share the same letters with the same powers.

`3x + 5x − 2 + 7 = 8x + 5`

You **cannot** combine `x` and `x²` — different powers, not like terms.',
'WJEC 3300 · 2.1 Expressions'),
('m-122',
'# Expected Frequency

`Expected frequency = probability × number of trials`

If P(red) = 0.2 and the spinner is spun 50 times, expect `0.2 × 50 = 10` reds.

This is what you would *expect* — actual results may vary (link to **relative frequency**).',
'WJEC 3300 · 4.1 Probability — Basic'),
('b-001',
'# Cells and Division

All living things are made of **cells**.

- **Animal cells**: nucleus, cytoplasm, cell membrane, mitochondria, ribosomes.
- **Plant cells** also have: cell wall, chloroplasts, permanent vacuole.
- **Bacterial (prokaryotic) cells**: no nucleus; DNA is a single loop.

## Mitosis
Body cells divide by **mitosis** — produces two genetically identical daughter cells. Used for growth and repair.

## Meiosis
Sex cells (gametes) form by **meiosis** — produces four genetically different cells with half the chromosomes.',
'WJEC GCSE Biology · Unit 1'),
('b-002',
'# Disease Defence and Treatment

Pathogens include **bacteria, viruses, fungi, protists**.

## The body''s defences
- Skin barrier
- Mucus and cilia in the airways
- Stomach acid kills swallowed pathogens
- White blood cells: **phagocytes** engulf, **lymphocytes** make **antibodies**

## Vaccination
A weakened pathogen triggers antibody production and **memory cells**, giving long-term immunity.',
'WJEC GCSE Biology · Unit 2'),
('b-003',
'# Response and Regulation

The **nervous system** uses electrical impulses for fast, short-lived responses.

`stimulus → receptor → sensory neurone → CNS → motor neurone → effector → response`

The **endocrine system** uses hormones in the blood — slower, longer-lasting.

## Homeostasis
Maintaining a constant internal environment (temperature, blood glucose, water). **Insulin** lowers blood glucose; **glucagon** raises it.',
'WJEC GCSE Biology · Unit 3'),
('b-004',
'# DNA and Inheritance

**DNA** is a double helix made of nucleotides with bases **A-T** and **C-G**.

A **gene** is a section of DNA that codes for a protein. **Alleles** are versions of a gene (dominant or recessive).

## Punnett squares
Cross `Bb × Bb`: offspring 1 BB : 2 Bb : 1 bb → ratio 3 brown : 1 blue.',
'WJEC GCSE Biology · Unit 4'),
('b-005',
'# Classification and Biodiversity

Living things are classified into the five **kingdoms**: animals, plants, fungi, protists, prokaryotes.

**Biodiversity** is the variety of species in an ecosystem. High biodiversity = stable ecosystem.

Threats: deforestation, pollution, climate change. Conservation: protected areas, captive breeding, seed banks.',
'WJEC GCSE Biology · Unit 5');

-- Questions (2 per seeded topic)
INSERT INTO questions (topic_id, question_text, mark_allocation, question_type, correct_answer, mark_scheme) VALUES
('m-001','Write down all the prime numbers between 20 and 30.',2,'short','23, 29','1 mark for each correct prime; deduct for any incorrect listing.'),
('m-001','Explain why 1 is not classified as a prime number.',3,'extended','A prime has exactly two distinct factors: 1 and itself. 1 only has one factor (itself), so it does not meet the definition.','1 mark: definition of prime; 1 mark: 1 has only one factor; 1 mark: clear comparison.'),
('m-002','Work out 0.6 × 0.4.',1,'short','0.24','1 mark for 0.24.'),
('m-002','Calculate 2.4 ÷ 0.06 without a calculator.',3,'extended','2.4 ÷ 0.06 = 240 ÷ 6 = 40','1: scale both by 100; 1: correct division 240÷6; 1: final answer 40.'),
('m-049','Solve: 3x + y = 11 and x − y = 1.',5,'extended','x = 3, y = 2','1: add equations; 1: 4x = 12; 1: x = 3; 1: substitute; 1: y = 2.'),
('m-049','Solve simultaneously: 2a + b = 9, a + b = 5.',3,'short','a = 4, b = 1','1: subtract equations; 1: a = 4; 1: b = 1.'),
('m-050','Complete the table for y = x² − 2 for x = -2,-1,0,1,2.',2,'short','2, -1, -2, -1, 2','2 marks all correct; 1 mark for 3 or 4 correct.'),
('m-050','Plot y = x² + x − 2 for −3 ≤ x ≤ 2 and describe the turning point.',5,'extended','Parabola; turning point near (−0.5, −2.25)','1: table; 2: plot; 1: smooth curve; 1: identify turning point.'),
('m-051','Find the value of 3a + 2b when a = 4 and b = -1.',2,'short','10','1: substitution; 1: correct evaluation.'),
('m-051','Evaluate 2x² − 3y when x = -3 and y = 4.',3,'extended','2(9) − 12 = 6','1: (−3)² = 9; 1: 18 − 12; 1: 6.'),
('m-052','Simplify 5x + 3 − 2x + 7.',2,'short','3x + 10','1: like terms grouped; 1: simplified.'),
('m-052','Simplify 4a + 3b − a + 5b − 2a.',3,'extended','a + 8b','1: a terms 4a−a−2a; 1: b terms 3b+5b; 1: final.'),
('m-122','A spinner has P(blue) = 0.3. It is spun 200 times. How many blues are expected?',2,'short','60','1: 0.3 × 200; 1: 60.'),
('m-122','A bag has 5 red, 3 green, 2 yellow balls. A ball is drawn and replaced 150 times. How many greens are expected?',3,'extended','45','1: P(green)=3/10; 1: 3/10 × 150; 1: 45.'),
('b-001','Name three structures found in a plant cell but not in an animal cell.',3,'short','Cell wall, chloroplasts, permanent vacuole','1 mark each.'),
('b-001','Compare mitosis and meiosis in terms of number of daughter cells and chromosome number.',4,'extended','Mitosis: 2 identical cells, full chromosome number. Meiosis: 4 different cells, half chromosome number.','1: mitosis cells; 1: mitosis chromosomes; 1: meiosis cells; 1: meiosis chromosomes.'),
('b-002','State two physical barriers the body uses against pathogens.',2,'short','Skin; mucus/cilia in airways','1 mark each.'),
('b-002','Explain how vaccination produces long-term immunity.',4,'extended','Weakened pathogen → lymphocytes make antibodies → memory cells remain → faster response on re-infection.','1: weakened pathogen; 1: antibody production; 1: memory cells; 1: faster secondary response.'),
('b-003','Describe the reflex arc pathway.',3,'short','stimulus → receptor → sensory neurone → CNS → motor neurone → effector → response','1 mark per stage group.'),
('b-003','Explain how insulin and glucagon regulate blood glucose.',4,'extended','Insulin lowers glucose by causing liver to convert glucose to glycogen. Glucagon raises glucose by converting glycogen back.','1 each: insulin role, glycogen storage, glucagon role, conversion back.'),
('b-004','What are the four DNA bases and how do they pair?',2,'short','A-T and C-G','1: bases named; 1: pairing.'),
('b-004','A father is Bb and mother is bb for a trait. Use a Punnett square to find offspring ratios.',4,'extended','50% Bb, 50% bb','1: correct cross; 1: gametes; 1: offspring genotypes; 1: ratio.'),
('b-005','Name the five kingdoms of life.',2,'short','Animals, plants, fungi, protists, prokaryotes','2 marks all five; 1 mark for 3 or 4.'),
('b-005','Explain two human activities that reduce biodiversity and one method to protect it.',4,'extended','Deforestation removes habitats; pollution kills species. Protected areas conserve habitats.','1 each: two threats; 1: conservation method; 1: clear explanation.');

-- Flashcards (3 per seeded topic, front/back)
INSERT INTO flashcards (topic_id, front, back) VALUES
('m-001','What is a prime number?','A whole number > 1 with exactly two factors: 1 and itself.'),
('m-001','Is 2 prime?','Yes — the only even prime.'),
('m-001','List all primes under 20.','2, 3, 5, 7, 11, 13, 17, 19.'),
('m-002','0.5 × 0.2 = ?','0.10'),
('m-002','How do you divide by a decimal?','Multiply both numbers by 10/100/… so the divisor is whole.'),
('m-002','3.6 ÷ 0.04 = ?','90'),
('m-049','Two ways to solve simultaneous equations?','Elimination and substitution.'),
('m-049','First step in elimination?','Make one variable have equal coefficients.'),
('m-049','Solve x + y = 5, x − y = 1.','x = 3, y = 2.'),
('m-050','Shape of a quadratic graph?','Parabola.'),
('m-050','How should you join quadratic plot points?','Smooth curve, never straight lines.'),
('m-050','What is the turning point?','Minimum (a>0) or maximum (a<0) of the parabola.'),
('m-051','What does substitution mean?','Replace each letter with its given value, then evaluate.'),
('m-051','(−3)² = ?','9'),
('m-051','If a=2, b=−1, find 3a+2b.','4'),
('m-052','What are like terms?','Terms with the same letters and the same powers.'),
('m-052','Simplify 4x + 2x − x.','5x'),
('m-052','Can you combine x and x²?','No — different powers.'),
('m-122','Formula for expected frequency?','Probability × number of trials.'),
('m-122','P=0.4, 100 trials. Expected?','40'),
('m-122','Why may actual ≠ expected frequency?','Randomness — relative frequency converges with more trials.'),
('b-001','Three plant-only cell structures?','Cell wall, chloroplasts, permanent vacuole.'),
('b-001','What is mitosis used for?','Growth and repair — identical daughter cells.'),
('b-001','How many cells does meiosis produce?','Four genetically different gametes with half the chromosomes.'),
('b-002','Name four types of pathogen.','Bacteria, viruses, fungi, protists.'),
('b-002','What do phagocytes do?','Engulf and digest pathogens.'),
('b-002','How does a vaccine give immunity?','Triggers antibody and memory-cell production.'),
('b-003','Order of the reflex arc?','Stimulus → receptor → sensory → CNS → motor → effector → response.'),
('b-003','What does insulin do?','Lowers blood glucose by storing it as glycogen.'),
('b-003','What does glucagon do?','Raises blood glucose by converting glycogen back.'),
('b-004','DNA base pairs?','A-T and C-G.'),
('b-004','What is an allele?','A version of a gene (dominant or recessive).'),
('b-004','Bb × Bb offspring ratio?','3 dominant : 1 recessive.'),
('b-005','Five kingdoms of life?','Animals, plants, fungi, protists, prokaryotes.'),
('b-005','What is biodiversity?','The variety of species in an ecosystem.'),
('b-005','One conservation method?','Protected areas / captive breeding / seed banks.');
