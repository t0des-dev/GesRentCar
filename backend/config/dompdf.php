<?php

return [
    'show_warnings' => false,
    'public_path' => null,
    'convert_entities' => false,

    'options' => [
        'font_dir' => storage_path('fonts'),
        'font_cache' => storage_path('fonts'),
        'temp_dir' => sys_get_temp_dir(),
        'chroot' => realpath(base_path()),
        'allowed_protocols' => [
            'data://' => ['rules' => []],
            'file://' => ['rules' => []],
            'http://' => ['rules' => []],
            'https://' => ['rules' => []],
        ],
        'artifactPathValidation' => null,
        'log_output_file' => null,
        'enable_font_subsetting' => false,
        'pdf_backend' => 'CPDF',
        'default_media_type' => 'screen',
        'default_paper_size' => 'a4',
        'default_paper_orientation' => 'portrait',
        'default_font' => 'DejaVu Sans',
        'dpi' => 150,
        'font_height_ratio' => 1.1,
        'is_remote_enabled' => false,
        'is_html5_parser_enabled' => true,
        'is_font_subsetting_enabled' => false,
        'debug_keep_temp' => false,
        'debug_css' => false,
        'debug_layout' => false,
        'debug_layout_width' => false,
        'debug_layout_height' => false,
    ],

    'render' => [
        'default_orientation' => 'portrait',
        'default_paper_size' => 'a4',
        'default_font' => 'DejaVu Sans',
    ],
];
