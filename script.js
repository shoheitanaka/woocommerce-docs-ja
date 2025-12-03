/**
 * WooCommerce Docs Japanese - JavaScript
 * Version: 1.0.0
 */

(function($) {
    'use strict';

    /**
     * バージョン切り替え機能
     */
    const versionSwitcher = {
        init: function() {
            this.bindEvents();
            this.initializeVersion();
        },

        bindEvents: function() {
            $(document).on('change', '.wc-docs-version-select', this.handleVersionChange.bind(this));
        },

        initializeVersion: function() {
            const currentVersion = wcDocsJa.currentVersion;
            $('.wc-docs-version-select').val(currentVersion);
        },

        handleVersionChange: function(e) {
            const selectedVersion = $(e.target).val();
            const currentUrl = new URL(window.location.href);
            
            // URLパラメータにバージョンを追加
            currentUrl.searchParams.set('version', selectedVersion);
            
            // ページをリロード
            window.location.href = currentUrl.toString();
        }
    };

    /**
     * 目次のスムーズスクロール
     */
    const smoothScroll = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('.wc-docs-toc a').on('click', this.handleClick.bind(this));
        },

        handleClick: function(e) {
            const href = $(e.currentTarget).attr('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const $target = $('#' + targetId);
                
                if ($target.length) {
                    const offsetTop = $target.offset().top - 80;
                    
                    $('html, body').animate({
                        scrollTop: offsetTop
                    }, 500);
                    
                    // URLを更新
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        }
    };

    /**
     * コードブロックのコピー機能
     */
    const codeBlockCopy = {
        init: function() {
            this.addCopyButtons();
            this.bindEvents();
        },

        addCopyButtons: function() {
            $('.wc-docs-embed pre').each(function() {
                const $pre = $(this);
                const $button = $('<button>', {
                    class: 'wc-docs-copy-button',
                    text: 'Copy',
                    'aria-label': 'Copy code to clipboard'
                });
                
                $pre.css('position', 'relative');
                $button.css({
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    border: '1px solid #d0d7de',
                    borderRadius: '4px',
                    background: '#ffffff',
                    color: '#24292f'
                });
                
                $pre.append($button);
            });
        },

        bindEvents: function() {
            $(document).on('click', '.wc-docs-copy-button', this.handleCopy.bind(this));
        },

        handleCopy: function(e) {
            const $button = $(e.currentTarget);
            const $pre = $button.parent();
            const $code = $pre.find('code');
            const text = $code.text();
            
            // クリップボードにコピー
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showCopySuccess($button);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            } else {
                // フォールバック
                this.fallbackCopy(text);
                this.showCopySuccess($button);
            }
        },

        fallbackCopy: function(text) {
            const $textarea = $('<textarea>');
            $textarea.val(text);
            $textarea.css({
                position: 'fixed',
                opacity: 0
            });
            $('body').append($textarea);
            $textarea[0].select();
            document.execCommand('copy');
            $textarea.remove();
        },

        showCopySuccess: function($button) {
            const originalText = $button.text();
            $button.text('Copied!');
            $button.css('color', '#0969da');
            
            setTimeout(() => {
                $button.text(originalText);
                $button.css('color', '#24292f');
            }, 2000);
        }
    };

    /**
     * 検索機能（オプション）
     */
    const docsSearch = {
        init: function() {
            this.createSearchBox();
            this.bindEvents();
        },

        createSearchBox: function() {
            const $searchBox = $('<div>', {
                class: 'wc-docs-search-box',
                html: '<input type="search" class="wc-docs-search-input" placeholder="Search documentation...">'
            });
            
            $('.wc-docs-toc').before($searchBox);
        },

        bindEvents: function() {
            let searchTimeout;
            
            $(document).on('input', '.wc-docs-search-input', function() {
                clearTimeout(searchTimeout);
                const query = $(this).val().toLowerCase();
                
                searchTimeout = setTimeout(() => {
                    docsSearch.performSearch(query);
                }, 300);
            });
        },

        performSearch: function(query) {
            if (!query) {
                $('.wc-docs-embed').find('*').removeClass('wc-docs-highlight');
                return;
            }
            
            $('.wc-docs-embed').find('*').removeClass('wc-docs-highlight');
            
            $('.wc-docs-embed').find('p, li, td, th').each(function() {
                const text = $(this).text().toLowerCase();
                if (text.includes(query)) {
                    $(this).addClass('wc-docs-highlight');
                }
            });
        }
    };

    /**
     * レスポンシブナビゲーション
     */
    const responsiveNav = {
        init: function() {
            this.handleResize();
            this.bindEvents();
        },

        bindEvents: function() {
            $(window).on('resize', this.handleResize.bind(this));
        },

        handleResize: function() {
            const width = $(window).width();
            
            if (width < 768) {
                // モバイル表示の調整
                $('.wc-docs-toc').addClass('mobile');
            } else {
                $('.wc-docs-toc').removeClass('mobile');
            }
        }
    };

    /**
     * 初期化
     */
    $(document).ready(function() {
        versionSwitcher.init();
        smoothScroll.init();
        codeBlockCopy.init();
        responsiveNav.init();
        
        // 検索機能は必要に応じて有効化
        // docsSearch.init();
        
        console.log('WooCommerce Docs Japanese loaded');
    });

})(jQuery);
