/*
- Superfish
- Supersubs
- Sidr - responsive menu
- Sticky
- PrettyPhoto v3.1.5
- FlexSlider v2.1 - Version 2.2 is buggy, zzz
*/


/*
 * jQuery Superfish Menu Plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */
(function($){
    var methods=function(){
        var c={
            bcClass:"sf-breadcrumb",
            menuClass:"sf-js-enabled",
            anchorClass:"sf-with-ul",
            menuArrowClass:"sf-arrows"
        },ios=function(){
            var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);
            if(ios)$(window).load(function(){
                $("body").children().on("click",$.noop)
            });
            return ios
        }(),wp7=function(){
            var style=document.documentElement.style;
            return"behavior"in style&&("fill"in style&&/iemobile/i.test(navigator.userAgent))
        }(),toggleMenuClasses=function($menu,o){
            var classes=c.menuClass;
            if(o.cssArrows)classes+=" "+c.menuArrowClass;
            $menu.toggleClass(classes)
        },setPathToCurrent=function($menu,o){
            return $menu.find("li."+o.pathClass).slice(0,o.pathLevels).addClass(o.hoverClass+" "+c.bcClass).filter(function(){
                return $(this).children(o.popUpSelector).hide().show().length
            }).removeClass(o.pathClass)
        },toggleAnchorClass=function($li){
            $li.children("a").toggleClass(c.anchorClass)
        },toggleTouchAction=function($menu){
            var touchAction=$menu.css("ms-touch-action");
            touchAction=touchAction==="pan-y"?
            "auto":"pan-y";
            $menu.css("ms-touch-action",touchAction)
        },applyHandlers=function($menu,o){
            var targets="li:has("+o.popUpSelector+")";
            if($.fn.hoverIntent&&!o.disableHI)$menu.hoverIntent(over,out,targets);else $menu.on("mouseenter.superfish",targets,over).on("mouseleave.superfish",targets,out);
            var touchevent="MSPointerDown.superfish";
            if(!ios)touchevent+=" touchend.superfish";
            if(wp7)touchevent+=" mousedown.superfish";
            $menu.on("focusin.superfish","li",over).on("focusout.superfish","li",out).on(touchevent,
                "a",o,touchHandler)
        },touchHandler=function(e){
            var $this=$(this),$ul=$this.siblings(e.data.popUpSelector);
            if($ul.length>0&&$ul.is(":hidden")){
                $this.one("click.superfish",false);
                if(e.type==="MSPointerDown")$this.trigger("focus");else $.proxy(over,$this.parent("li"))()
            }
        },over=function(){
            var $this=$(this),o=getOptions($this);
            clearTimeout(o.sfTimer);
            $this.siblings().superfish("hide").end().superfish("show")
        },out=function(){
            var $this=$(this),o=getOptions($this);
            if(ios)$.proxy(close,$this,o)();
            else{
                clearTimeout(o.sfTimer);
                o.sfTimer=setTimeout($.proxy(close,$this,o),o.delay)
            }
        },close=function(o){
            o.retainPath=$.inArray(this[0],o.$path)>-1;
            this.superfish("hide");
            if(!this.parents("."+o.hoverClass).length){
                o.onIdle.call(getMenu(this));
                if(o.$path.length)$.proxy(over,o.$path)()
            }
        },getMenu=function($el){
            return $el.closest("."+c.menuClass)
        },getOptions=function($el){
            return getMenu($el).data("sf-options")
        };
    
        return{
            hide:function(instant){
                if(this.length){
                    var $this=this,o=getOptions($this);
                    if(!o)return this;
                    var not=o.retainPath===
                    true?o.$path:"",$ul=$this.find("li."+o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),speed=o.speedOut;
                    if(instant){
                        $ul.show();
                        speed=0
                    }
                    o.retainPath=false;
                    o.onBeforeHide.call($ul);
                    $ul.stop(true,true).animate(o.animationOut,speed,function(){
                        var $this=$(this);
                        o.onHide.call($this)
                    })
                }
                return this
            },
            show:function(){
                var o=getOptions(this);
                if(!o)return this;
                var $this=this.addClass(o.hoverClass),$ul=$this.children(o.popUpSelector);
                o.onBeforeShow.call($ul);
                $ul.stop(true,true).animate(o.animation,
                    o.speed,function(){
                        o.onShow.call($ul)
                    });
                return this
            },
            destroy:function(){
                return this.each(function(){
                    var $this=$(this),o=$this.data("sf-options"),$hasPopUp;
                    if(!o)return false;
                    $hasPopUp=$this.find(o.popUpSelector).parent("li");
                    clearTimeout(o.sfTimer);
                    toggleMenuClasses($this,o);
                    toggleAnchorClass($hasPopUp);
                    toggleTouchAction($this);
                    $this.off(".superfish").off(".hoverIntent");
                    $hasPopUp.children(o.popUpSelector).attr("style",function(i,style){
                        return style.replace(/display[^;]+;?/g,"")
                    });
                    o.$path.removeClass(o.hoverClass+
                        " "+c.bcClass).addClass(o.pathClass);
                    $this.find("."+o.hoverClass).removeClass(o.hoverClass);
                    o.onDestroy.call($this);
                    $this.removeData("sf-options")
                })
            },
            init:function(op){
                return this.each(function(){
                    var $this=$(this);
                    if($this.data("sf-options"))return false;
                    var o=$.extend({},$.fn.superfish.defaults,op),$hasPopUp=$this.find(o.popUpSelector).parent("li");
                    o.$path=setPathToCurrent($this,o);
                    $this.data("sf-options",o);
                    toggleMenuClasses($this,o);
                    toggleAnchorClass($hasPopUp);
                    toggleTouchAction($this);
                    applyHandlers($this,
                        o);
                    $hasPopUp.not("."+c.bcClass).superfish("hide",true);
                    o.onInit.call(this)
                })
            }
        }
    }();
    $.fn.superfish=function(method,args){
        if(methods[method])return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        else if(typeof method==="object"||!method)return methods.init.apply(this,arguments);else return $.error("Method "+method+" does not exist on jQuery.fn.superfish")
    };
        
    $.fn.superfish.defaults={
        popUpSelector:"ul,.sf-mega",
        hoverClass:"sfHover",
        pathClass:"overrideThisToUse",
        pathLevels:1,
        delay:800,
        animation:{
            opacity:"show"
        },
        animationOut:{
            opacity:"hide"
        },
        speed:"normal",
        speedOut:"fast",
        cssArrows:true,
        disableHI:false,
        onInit:$.noop,
        onBeforeShow:$.noop,
        onShow:$.noop,
        onBeforeHide:$.noop,
        onHide:$.noop,
        onIdle:$.noop,
        onDestroy:$.noop
    };
    
    $.fn.extend({
        hideSuperfishUl:methods.hide,
        showSuperfishUl:methods.show
    })
})(jQuery);

/* ------------------------------------------------------------------------
	Class: prettyPhoto
	Use: Lightbox clone for jQuery
	Author: Stephane Caron (http://www.no-margin-for-errors.com)
	Version: 3.1.5
------------------------------------------------------------------------- */
(function(e){
    function t(){
        var e=location.href;
        hashtag=e.indexOf("#prettyPhoto")!==-1?decodeURI(e.substring(e.indexOf("#prettyPhoto")+1,e.length)):false;
        return hashtag
    }
    function n(){
        if(typeof theRel=="undefined")return;
        location.hash=theRel+"/"+rel_index+"/"
    }
    function r(){
        if(location.href.indexOf("#prettyPhoto")!==-1)location.hash="prettyPhoto"
    }
    function i(e,t){
        e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
        var n="[\\?&]"+e+"=([^&#]*)";
        var r=new RegExp(n);
        var i=r.exec(t);
        return i==null?"":i[1]
    }
    e.prettyPhoto={
        version:"3.1.5"
    };
    
    e.fn.prettyPhoto=function(s){
        function g(){
            e(".pp_loaderIcon").hide();
            projectedTop=scroll_pos["scrollTop"]+(d/2-a["containerHeight"]/2);
            if(projectedTop<0)projectedTop=0;
            $ppt.fadeTo(settings.animation_speed,1);
            $pp_pic_holder.find(".pp_content").animate({
                height:a["contentHeight"],
                width:a["contentWidth"]
            },settings.animation_speed);
            $pp_pic_holder.animate({
                top:projectedTop,
                left:v/2-a["containerWidth"]/2<0?0:v/2-a["containerWidth"]/2,
                width:a["containerWidth"]
            },settings.animation_speed,function(){
                $pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(a["height"]).width(a["width"]);
                $pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed);
                if(isSet&&S(pp_images[set_position])=="image"){
                    $pp_pic_holder.find(".pp_hoverContainer").show()
                }else{
                    $pp_pic_holder.find(".pp_hoverContainer").hide()
                }
                if(settings.allow_expand){
                    if(a["resized"]){
                        e("a.pp_expand,a.pp_contract").show()
                    }else{
                        e("a.pp_expand").hide()
                    }
                }
                if(settings.autoplay_slideshow&&!m&&!f)e.prettyPhoto.startSlideshow();
                settings.changepicturecallback();
                f=true
            });
            C();
            s.ajaxcallback()
        }
        function y(t){
            $pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility","hidden");
            $pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed,function(){
                e(".pp_loaderIcon").show();
                t()
            })
        }
        function b(t){
            t>1?e(".pp_nav").show():e(".pp_nav").hide()
        }
        function w(e,t){
            resized=false;
            E(e,t);
            imageWidth=e,imageHeight=t;
            if((p>v||h>d)&&doresize&&settings.allow_resize&&!u){
                resized=true,fitting=false;
                while(!fitting){
                    if(p>v){
                        imageWidth=v-200;
                        imageHeight=t/e*imageWidth
                    }else if(h>d){
                        imageHeight=d-200;
                        imageWidth=e/t*imageHeight
                    }else{
                        fitting=true
                    }
                    h=imageHeight,p=imageWidth
                }
                if(p>v||h>d){
                    w(p,h)
                }
                E(imageWidth,imageHeight)
            }
            return{
                width:Math.floor(imageWidth),
                height:Math.floor(imageHeight),
                containerHeight:Math.floor(h),
                containerWidth:Math.floor(p)+settings.horizontal_padding*2,
                contentHeight:Math.floor(l),
                contentWidth:Math.floor(c),
                resized:resized
            }
        }
        function E(t,n){
            t=parseFloat(t);
            n=parseFloat(n);
            $pp_details=$pp_pic_holder.find(".pp_details");
            $pp_details.width(t);
            detailsHeight=parseFloat($pp_details.css("marginTop"))+parseFloat($pp_details.css("marginBottom"));
            $pp_details=$pp_details.clone().addClass(settings.theme).width(t).appendTo(e("body")).css({
                position:"absolute",
                top:-1e4
            });
            detailsHeight+=$pp_details.height();
            detailsHeight=detailsHeight<=34?36:detailsHeight;
            $pp_details.remove();
            $pp_title=$pp_pic_holder.find(".ppt");
            $pp_title.width(t);
            titleHeight=parseFloat($pp_title.css("marginTop"))+parseFloat($pp_title.css("marginBottom"));
            $pp_title=$pp_title.clone().appendTo(e("body")).css({
                position:"absolute",
                top:-1e4
            });
            titleHeight+=$pp_title.height();
            $pp_title.remove();
            l=n+detailsHeight;
            c=t;
            h=l+titleHeight+$pp_pic_holder.find(".pp_top").height()+$pp_pic_holder.find(".pp_bottom").height();
            p=t
        }
        function S(e){
            if(e.match(/youtube\.com\/watch/i)||e.match(/youtu\.be/i)){
                return"youtube"
            }else if(e.match(/vimeo\.com/i)){
                return"vimeo"
            }else if(e.match(/\b.mov\b/i)){
                return"quicktime"
            }else if(e.match(/\b.swf\b/i)){
                return"flash"
            }else if(e.match(/\biframe=true\b/i)){
                return"iframe"
            }else if(e.match(/\bajax=true\b/i)){
                return"ajax"
            }else if(e.match(/\bcustom=true\b/i)){
                return"custom"
            }else if(e.substr(0,1)=="#"){
                return"inline"
            }else{
                return"image"
            }
        }
        function x(){
            if(doresize&&typeof $pp_pic_holder!="undefined"){
                scroll_pos=T();
                contentHeight=$pp_pic_holder.height(),contentwidth=$pp_pic_holder.width();
                projectedTop=d/2+scroll_pos["scrollTop"]-contentHeight/2;
                if(projectedTop<0)projectedTop=0;
                if(contentHeight>d)return;
                $pp_pic_holder.css({
                    top:projectedTop,
                    left:v/2+scroll_pos["scrollLeft"]-contentwidth/2
                })
            }
        }
        function T(){
            if(self.pageYOffset){
                return{
                    scrollTop:self.pageYOffset,
                    scrollLeft:self.pageXOffset
                }
            }else if(document.documentElement&&document.documentElement.scrollTop){
                return{
                    scrollTop:document.documentElement.scrollTop,
                    scrollLeft:document.documentElement.scrollLeft
                }
            }else if(document.body){
                return{
                    scrollTop:document.body.scrollTop,
                    scrollLeft:document.body.scrollLeft
                }
            }
        }
        function N(){
            d=e(window).height(),v=e(window).width();
            if(typeof $pp_overlay!="undefined")$pp_overlay.height(e(document).height()).width(v)
        }
        function C(){
            if(isSet&&settings.overlay_gallery&&S(pp_images[set_position])=="image"){
                itemWidth=52+5;
                navWidth=settings.theme=="facebook"||settings.theme=="pp_default"?50:30;
                itemsPerPage=Math.floor((a["containerWidth"]-100-navWidth)/itemWidth);
                itemsPerPage=itemsPerPage<pp_images.length?itemsPerPage:pp_images.length;
                totalPage=Math.ceil(pp_images.length/itemsPerPage)-1;
                if(totalPage==0){
                    navWidth=0;
                    $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()
                }else{
                    $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show()
                }
                galleryWidth=itemsPerPage*itemWidth;
                fullGalleryWidth=pp_images.length*itemWidth;
                $pp_gallery.css("margin-left",-(galleryWidth/2+navWidth/2)).find("div:first").width(galleryWidth+5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected");
                goToPage=Math.floor(set_position/itemsPerPage)<totalPage?Math.floor(set_position/itemsPerPage):totalPage;
                e.prettyPhoto.changeGalleryPage(goToPage);
                $pp_gallery_li.filter(":eq("+set_position+")").addClass("selected")
            }else{
                $pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")
            }
        }
        function k(t){
            if(settings.social_tools)facebook_like_link=settings.social_tools.replace("{location_href}",encodeURIComponent(location.href));
            settings.markup=settings.markup.replace("{pp_social}","");
            e("body").append(settings.markup);
            $pp_pic_holder=e(".pp_pic_holder"),$ppt=e(".ppt"),$pp_overlay=e("div.pp_overlay");
            if(isSet&&settings.overlay_gallery){
                currentGalleryPage=0;
                toInject="";
                for(var n=0;n<pp_images.length;n++){
                    if(!pp_images[n].match(/\b(jpg|jpeg|png|gif)\b/gi)){
                        classname="default";
                        img_src=""
                    }else{
                        classname="";
                        img_src=pp_images[n]
                    }
                    toInject+="<li class='"+classname+"'><a href='#'><img src='"+img_src+"' width='50' alt='' /></a></li>"
                }
                toInject=settings.gallery_markup.replace(/{gallery}/g,toInject);
                $pp_pic_holder.find("#pp_full_res").after(toInject);
                $pp_gallery=e(".pp_pic_holder .pp_gallery"),$pp_gallery_li=$pp_gallery.find("li");
                $pp_gallery.find(".pp_arrow_next").click(function(){
                    e.prettyPhoto.changeGalleryPage("next");
                    e.prettyPhoto.stopSlideshow();
                    return false
                });
                $pp_gallery.find(".pp_arrow_previous").click(function(){
                    e.prettyPhoto.changeGalleryPage("previous");
                    e.prettyPhoto.stopSlideshow();
                    return false
                });
                $pp_pic_holder.find(".pp_content").hover(function(){
                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()
                },function(){
                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()
                });
                itemWidth=52+5;
                $pp_gallery_li.each(function(t){
                    e(this).find("a").click(function(){
                        e.prettyPhoto.changePage(t);
                        e.prettyPhoto.stopSlideshow();
                        return false
                    })
                })
            }
            if(settings.slideshow){
                $pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>');
                $pp_pic_holder.find(".pp_nav .pp_play").click(function(){
                    e.prettyPhoto.startSlideshow();
                    return false
                })
            }
            $pp_pic_holder.attr("class","pp_pic_holder "+settings.theme);
            $pp_overlay.css({
                opacity:0,
                height:e(document).height(),
                width:e(window).width()
            }).bind("click",function(){
                if(!settings.modal)e.prettyPhoto.close()
            });
            e("a.pp_close").bind("click",function(){
                e.prettyPhoto.close();
                return false
            });
            if(settings.allow_expand){
                e("a.pp_expand").bind("click",function(t){
                    if(e(this).hasClass("pp_expand")){
                        e(this).removeClass("pp_expand").addClass("pp_contract");
                        doresize=false
                    }else{
                        e(this).removeClass("pp_contract").addClass("pp_expand");
                        doresize=true
                    }
                    y(function(){
                        e.prettyPhoto.open()
                    });
                    return false
                })
            }
            $pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click",function(){
                e.prettyPhoto.changePage("previous");
                e.prettyPhoto.stopSlideshow();
                return false
            });
            $pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click",function(){
                e.prettyPhoto.changePage("next");
                e.prettyPhoto.stopSlideshow();
                return false
            });
            x()
        }
        s=jQuery.extend({
            hook:"rel",
            animation_speed:"fast",
            ajaxcallback:function(){},
            slideshow:5e3,
            autoplay_slideshow:false,
            opacity:.8,
            show_title:true,
            allow_resize:true,
            allow_expand:true,
            default_width:500,
            default_height:344,
            counter_separator_label:"/",
            theme:"pp_default",
            horizontal_padding:20,
            hideflash:false,
            wmode:"opaque",
            autoplay:true,
            modal:false,
            deeplinking:true,
            overlay_gallery:true,
            overlay_gallery_max:30,
            keyboard_shortcuts:true,
            changepicturecallback:function(){},
            callback:function(){},
            ie6_fallback:true,
            markup:'<div class="pp_pic_holder"> 						<div class="ppt"> </div> 						<div class="pp_top"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 						<div class="pp_content_container"> 							<div class="pp_left"> 							<div class="pp_right"> 								<div class="pp_content"> 									<div class="pp_loaderIcon"></div> 									<div class="pp_fade"> 										<a href="#" class="pp_expand" title="Expand the image">Expand</a> 										<div class="pp_hoverContainer"> 											<a class="pp_next" href="#">next</a> 											<a class="pp_previous" href="#">previous</a> 										</div> 										<div id="pp_full_res"></div> 										<div class="pp_details"> 											<div class="pp_nav"> 												<a href="#" class="pp_arrow_previous">Previous</a> 												<p class="currentTextHolder">0/0</p> 												<a href="#" class="pp_arrow_next">Next</a> 											</div> 											<p class="pp_description"></p> 											<div class="pp_social">{pp_social}</div> 											<a class="pp_close" href="#">Close</a> 										</div> 									</div> 								</div> 							</div> 							</div> 						</div> 						<div class="pp_bottom"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 					</div> 					<div class="pp_overlay"></div>',
            gallery_markup:'<div class="pp_gallery"> 								<a href="#" class="pp_arrow_previous">Previous</a> 								<div> 									<ul> 										{gallery} 									</ul> 								</div> 								<a href="#" class="pp_arrow_next">Next</a> 							</div>',
            image_markup:'<img id="fullResImage" src="{path}" />',
            flash_markup:'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup:'<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup:'<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup:'<div class="pp_inline">{content}</div>',
            custom_markup:"",
            social_tools:'<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&layout=button_count&show_faces=true&width=500&action=like&font&colorscheme=light&height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'
        },s);
        var o=this,u=false,a,f,l,c,h,p,d=e(window).height(),v=e(window).width(),m;
        doresize=true,scroll_pos=T();
        e(window).unbind("resize.prettyphoto").bind("resize.prettyphoto",function(){
            x();
            N()
        });
        if(s.keyboard_shortcuts){
            e(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto",function(t){
                if(typeof $pp_pic_holder!="undefined"){
                    if($pp_pic_holder.is(":visible")){
                        switch(t.keyCode){
                            case 37:
                                e.prettyPhoto.changePage("previous");
                                t.preventDefault();
                                break;
                            case 39:
                                e.prettyPhoto.changePage("next");
                                t.preventDefault();
                                break;
                            case 27:
                                if(!settings.modal)e.prettyPhoto.close();
                                t.preventDefault();
                                break
                        }
                    }
                }
            })
        }
        e.prettyPhoto.initialize=function(){
            settings=s;
            if(settings.theme=="pp_default")settings.horizontal_padding=16;
            theRel=e(this).attr(settings.hook);
            galleryRegExp=/\[(?:.*)\]/;
            isSet=galleryRegExp.exec(theRel)?true:false;
            pp_images=isSet?jQuery.map(o,function(t,n){
                if(e(t).attr(settings.hook).indexOf(theRel)!=-1)return e(t).attr("href")
            }):e.makeArray(e(this).attr("href"));
            pp_titles=isSet?jQuery.map(o,function(t,n){
                if(e(t).attr(settings.hook).indexOf(theRel)!=-1)return e(t).find("img").attr("alt")?e(t).find("img").attr("alt"):""
            }):e.makeArray(e(this).find("img").attr("alt"));
            pp_descriptions=isSet?jQuery.map(o,function(t,n){
                if(e(t).attr(settings.hook).indexOf(theRel)!=-1)return e(t).attr("title")?e(t).attr("title"):""
            }):e.makeArray(e(this).attr("title"));
            if(pp_images.length>settings.overlay_gallery_max)settings.overlay_gallery=false;
            set_position=jQuery.inArray(e(this).attr("href"),pp_images);
            rel_index=isSet?set_position:e("a["+settings.hook+"^='"+theRel+"']").index(e(this));
            k(this);
            if(settings.allow_resize)e(window).bind("scroll.prettyphoto",function(){
                x()
            });
            e.prettyPhoto.open();
            return false
        };
    
        e.prettyPhoto.open=function(t){
            if(typeof settings=="undefined"){
                settings=s;
                pp_images=e.makeArray(arguments[0]);
                pp_titles=arguments[1]?e.makeArray(arguments[1]):e.makeArray("");
                pp_descriptions=arguments[2]?e.makeArray(arguments[2]):e.makeArray("");
                isSet=pp_images.length>1?true:false;
                set_position=arguments[3]?arguments[3]:0;
                k(t.target)
            }
            if(settings.hideflash)e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility","hidden");
            b(e(pp_images).size());
            e(".pp_loaderIcon").show();
            if(settings.deeplinking)n();
            if(settings.social_tools){
                facebook_like_link=settings.social_tools.replace("{location_href}",encodeURIComponent(location.href));
                $pp_pic_holder.find(".pp_social").html(facebook_like_link)
            }
            if($ppt.is(":hidden"))$ppt.css("opacity",0).show();
            $pp_overlay.show().fadeTo(settings.animation_speed,settings.opacity);
            $pp_pic_holder.find(".currentTextHolder").text(set_position+1+settings.counter_separator_label+e(pp_images).size());
            if(typeof pp_descriptions[set_position]!="undefined"&&pp_descriptions[set_position]!=""){
                $pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position]))
            }else{
                $pp_pic_holder.find(".pp_description").hide()
            }
            movie_width=parseFloat(i("width",pp_images[set_position]))?i("width",pp_images[set_position]):settings.default_width.toString();
            movie_height=parseFloat(i("height",pp_images[set_position]))?i("height",pp_images[set_position]):settings.default_height.toString();
            u=false;
            if(movie_height.indexOf("%")!=-1){
                movie_height=parseFloat(e(window).height()*parseFloat(movie_height)/100-150);
                u=true
            }
            if(movie_width.indexOf("%")!=-1){
                movie_width=parseFloat(e(window).width()*parseFloat(movie_width)/100-150);
                u=true
            }
            $pp_pic_holder.fadeIn(function(){
                settings.show_title&&pp_titles[set_position]!=""&&typeof pp_titles[set_position]!="undefined"?$ppt.html(unescape(pp_titles[set_position])):$ppt.html(" ");
                imgPreloader="";
                skipInjection=false;
                switch(S(pp_images[set_position])){
                    case"image":
                        imgPreloader=new Image;
                        nextImage=new Image;
                        if(isSet&&set_position<e(pp_images).size()-1)nextImage.src=pp_images[set_position+1];
                        prevImage=new Image;
                        if(isSet&&pp_images[set_position-1])prevImage.src=pp_images[set_position-1];
                        $pp_pic_holder.find("#pp_full_res")[0].innerHTML=settings.image_markup.replace(/{path}/g,pp_images[set_position]);
                        imgPreloader.onload=function(){
                            a=w(imgPreloader.width,imgPreloader.height);
                            g()
                        };
                
                        imgPreloader.onerror=function(){
                            alert("Image cannot be loaded. Make sure the path is correct and image exist.");
                            e.prettyPhoto.close()
                        };
                
                        imgPreloader.src=pp_images[set_position];
                        break;
                    case"youtube":
                        a=w(movie_width,movie_height);
                        movie_id=i("v",pp_images[set_position]);
                        if(movie_id==""){
                            movie_id=pp_images[set_position].split("youtu.be/");
                            movie_id=movie_id[1];
                            if(movie_id.indexOf("?")>0)movie_id=movie_id.substr(0,movie_id.indexOf("?"));
                            if(movie_id.indexOf("&")>0)movie_id=movie_id.substr(0,movie_id.indexOf("&"))
                        }
                        movie="http://www.youtube.com/embed/"+movie_id;
                        i("rel",pp_images[set_position])?movie+="?rel="+i("rel",pp_images[set_position]):movie+="?rel=1";
                        if(settings.autoplay)movie+="&autoplay=1";
                        toInject=settings.iframe_markup.replace(/{width}/g,a["width"]).replace(/{height}/g,a["height"]).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);
                        break;
                    case"vimeo":
                        a=w(movie_width,movie_height);
                        movie_id=pp_images[set_position];
                        var t=/http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;
                        var n=movie_id.match(t);
                        movie="http://player.vimeo.com/video/"+n[3]+"?title=0&byline=0&portrait=0";
                        if(settings.autoplay)movie+="&autoplay=1;";
                        vimeo_width=a["width"]+"/embed/?moog_width="+a["width"];
                        toInject=settings.iframe_markup.replace(/{width}/g,vimeo_width).replace(/{height}/g,a["height"]).replace(/{path}/g,movie);
                        break;
                    case"quicktime":
                        a=w(movie_width,movie_height);
                        a["height"]+=15;
                        a["contentHeight"]+=15;
                        a["containerHeight"]+=15;
                        toInject=settings.quicktime_markup.replace(/{width}/g,a["width"]).replace(/{height}/g,a["height"]).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,pp_images[set_position]).replace(/{autoplay}/g,settings.autoplay);
                        break;
                    case"flash":
                        a=w(movie_width,movie_height);
                        flash_vars=pp_images[set_position];
                        flash_vars=flash_vars.substring(pp_images[set_position].indexOf("flashvars")+10,pp_images[set_position].length);
                        filename=pp_images[set_position];
                        filename=filename.substring(0,filename.indexOf("?"));
                        toInject=settings.flash_markup.replace(/{width}/g,a["width"]).replace(/{height}/g,a["height"]).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,filename+"?"+flash_vars);
                        break;
                    case"iframe":
                        a=w(movie_width,movie_height);
                        frame_url=pp_images[set_position];
                        frame_url=frame_url.substr(0,frame_url.indexOf("iframe")-1);
                        toInject=settings.iframe_markup.replace(/{width}/g,a["width"]).replace(/{height}/g,a["height"]).replace(/{path}/g,frame_url);
                        break;
                    case"ajax":
                        doresize=false;
                        a=w(movie_width,movie_height);
                        doresize=true;
                        skipInjection=true;
                        e.get(pp_images[set_position],function(e){
                            toInject=settings.inline_markup.replace(/{content}/g,e);
                            $pp_pic_holder.find("#pp_full_res")[0].innerHTML=toInject;
                            g()
                        });
                        break;
                    case"custom":
                        a=w(movie_width,movie_height);
                        toInject=settings.custom_markup;
                        break;
                    case"inline":
                        myClone=e(pp_images[set_position]).clone().append('<br clear="all" />').css({
                            width:settings.default_width
                        }).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(e("body")).show();
                        doresize=false;
                        a=w(e(myClone).width(),e(myClone).height());
                        doresize=true;
                        e(myClone).remove();
                        toInject=settings.inline_markup.replace(/{content}/g,e(pp_images[set_position]).html());
                        break
                }
                if(!imgPreloader&&!skipInjection){
                    $pp_pic_holder.find("#pp_full_res")[0].innerHTML=toInject;
                    g()
                }
            });
            return false
        };

        e.prettyPhoto.changePage=function(t){
            currentGalleryPage=0;
            if(t=="previous"){
                set_position--;
                if(set_position<0)set_position=e(pp_images).size()-1
            }else if(t=="next"){
                set_position++;
                if(set_position>e(pp_images).size()-1)set_position=0
            }else{
                set_position=t
            }
            rel_index=set_position;
            if(!doresize)doresize=true;
            if(settings.allow_expand){
                e(".pp_contract").removeClass("pp_contract").addClass("pp_expand")
            }
            y(function(){
                e.prettyPhoto.open()
            })
        };
    
        e.prettyPhoto.changeGalleryPage=function(e){
            if(e=="next"){
                currentGalleryPage++;
                if(currentGalleryPage>totalPage)currentGalleryPage=0
            }else if(e=="previous"){
                currentGalleryPage--;
                if(currentGalleryPage<0)currentGalleryPage=totalPage
            }else{
                currentGalleryPage=e
            }
            slide_speed=e=="next"||e=="previous"?settings.animation_speed:0;
            slide_to=currentGalleryPage*itemsPerPage*itemWidth;
            $pp_gallery.find("ul").animate({
                left:-slide_to
            },slide_speed)
        };
    
        e.prettyPhoto.startSlideshow=function(){
            if(typeof m=="undefined"){
                $pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function(){
                    e.prettyPhoto.stopSlideshow();
                    return false
                });
                m=setInterval(e.prettyPhoto.startSlideshow,settings.slideshow)
            }else{
                e.prettyPhoto.changePage("next")
            }
        };

        e.prettyPhoto.stopSlideshow=function(){
            $pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function(){
                e.prettyPhoto.startSlideshow();
                return false
            });
            clearInterval(m);
            m=undefined
        };
    
        e.prettyPhoto.close=function(){
            if($pp_overlay.is(":animated"))return;
            e.prettyPhoto.stopSlideshow();
            $pp_pic_holder.stop().find("object,embed").css("visibility","hidden");
            e("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed,function(){
                e(this).remove()
            });
            $pp_overlay.fadeOut(settings.animation_speed,function(){
                if(settings.hideflash)e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility","visible");
                e(this).remove();
                e(window).unbind("scroll.prettyphoto");
                r();
                settings.callback();
                doresize=true;
                f=false;
                delete settings
            })
        };
    
        if(!pp_alreadyInitialized&&t()){
            pp_alreadyInitialized=true;
            hashIndex=t();
            hashRel=hashIndex;
            hashIndex=hashIndex.substring(hashIndex.indexOf("/")+1,hashIndex.length-1);
            hashRel=hashRel.substring(0,hashRel.indexOf("/"));
            setTimeout(function(){
                e("a["+s.hook+"^='"+hashRel+"']:eq("+hashIndex+")").trigger("click")
            },50)
        }
        return this.unbind("click.prettyphoto").bind("click.prettyphoto",e.prettyPhoto.initialize)
    };

})(jQuery);
var pp_alreadyInitialized=false;

/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013 Alberto Varela
 * Licensed under the MIT license.
 */
(function(e){
    var t=false,n=false;
    var r={
        isUrl:function(e){
            var t=new RegExp("^(https?:\\/\\/)?"+"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+"((\\d{1,3}\\.){3}\\d{1,3}))"+"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+"(\\?[;&a-z\\d%_.~+=-]*)?"+"(\\#[-a-z\\d_]*)?$","i");
            if(!t.test(e)){
                return false
            }else{
                return true
            }
        },
        loadContent:function(e,t){
            e.html(t)
        },
        addPrefix:function(e){
            var t=e.attr("id"),n=e.attr("class");
            if(typeof t==="string"&&""!==t){
                e.attr("id",t.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-id-$1"))
            }
            if(typeof n==="string"&&""!==n&&"sidr-inner"!==n){
                e.attr("class",n.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-class-$1"))
            }
            e.removeAttr("style")
        },
        execute:function(r,s,o){
            if(typeof s==="function"){
                o=s;
                s="sidr"
            }else if(!s){
                s="sidr"
            }
            var u=e("#"+s),a=e(u.data("body")),f=e("html"),l=u.outerWidth(true),c=u.data("speed"),h=u.data("side"),p,d,v;
            if("open"===r||"toogle"===r&&!u.is(":visible")){
                if(u.is(":visible")||t){
                    return
                }
                if(n!==false){
                    i.close(n,function(){
                        i.open(s)
                    });
                    return
                }
                t=true;
                if(h==="left"){
                    p={
                        left:l+"px"
                    };
                    
                    d={
                        left:"0px"
                    }
                }else{
                    p={
                        right:l+"px"
                    };
                
                    d={
                        right:"0px"
                    }
                }
                v=f.scrollTop();
                f.css("overflow-x","hidden").scrollTop(v);
                a.css({
                    width:a.width(),
                    position:"absolute"
                }).animate(p,c);
                u.css("display","block").animate(d,c,function(){
                    t=false;
                    n=s;
                    if(typeof o==="function"){
                        o(s)
                    }
                })
            }else{
                if(!u.is(":visible")||t){
                    return
                }
                t=true;
                if(h==="left"){
                    p={
                        left:0
                    };
        
                    d={
                        left:"-"+l+"px"
                    }
                }else{
                    p={
                        right:0
                    };
    
                    d={
                        right:"-"+l+"px"
                    }
                }
                v=f.scrollTop();
                f.removeAttr("style").scrollTop(v);
                a.animate(p,c);
                u.animate(d,c,function(){
                    u.removeAttr("style");
                    a.removeAttr("style");
                    e("html").removeAttr("style");
                    t=false;
                    n=false;
                    if(typeof o==="function"){
                        o(s)
                    }
                })
            }
        }
    };

    var i={
        open:function(e,t){
            r.execute("open",e,t)
        },
        close:function(e,t){
            r.execute("close",e,t)
        },
        toogle:function(e,t){
            r.execute("toogle",e,t)
        }
    };

    e.sidr=function(t){
        if(i[t]){
            return i[t].apply(this,Array.prototype.slice.call(arguments,1))
        }else if(typeof t==="function"||typeof t==="string"||!t){
            return i.toogle.apply(this,arguments)
        }else{
            e.error("Method "+t+" does not exist on jQuery.sidr")
        }
    };

    e.fn.sidr=function(t){
        var n=e.extend({
            name:"sidr",
            speed:200,
            side:"left",
            source:null,
            renaming:true,
            body:"body"
        },t);
        var s=n.name,o=e("#"+s);
        if(o.length===0){
            o=e("<div />").attr("id",s).appendTo(e("body"))
        }
        o.addClass("sidr").addClass(n.side).data({
            speed:n.speed,
            side:n.side,
            body:n.body
        });
        if(typeof n.source==="function"){
            var u=n.source(s);
            r.loadContent(o,u)
        }else if(typeof n.source==="string"&&r.isUrl(n.source)){
            e.get(n.source,function(e){
                r.loadContent(o,e)
            })
        }else if(typeof n.source==="string"){
            var a="",f=n.source.split(",");
            e.each(f,function(t,n){
                a+='<div class="sidr-inner">'+e(n).html()+"</div>"
            });
            if(n.renaming){
                var l=e("<div />").html(a);
                l.find("*").each(function(t,n){
                    var i=e(n);
                    r.addPrefix(i)
                });
                a=l.html()
            }
            r.loadContent(o,a)
        }else if(n.source!==null){
            e.error("Invalid Sidr Source")
        }
        return this.each(function(){
            var t=e(this),n=t.data("sidr");
            if(!n){
                t.data("sidr",s);
                t.click(function(e){
                    e.preventDefault();
                    i.toogle(s)
                })
            }
        })
    }
})(jQuery);


// Sticky Plugin
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2011-02-14
// Date: 2012-08-30
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function($){
    var defaults={
        topSpacing:0,
        bottomSpacing:0,
        elementClassName:"is-sticky",
        wrapperClassName:"sticky-wrapper"
    },$window=$(window),$document=$(document),sticked=typeof sticked!="undefined"&&sticked instanceof Array?sticked:[];
    windowHeight=$window.height(),scroller=function(forceRefresh){
        var scrollTop=$window.scrollTop(),documentHeight=$document.height(),dwh=documentHeight-windowHeight,extra=scrollTop>dwh?dwh-scrollTop:0;
        for(var i=0;i<sticked.length;i++){
            var s=sticked[i],elementTop=s.stickyWrapper.offset().top,
            etse=elementTop-s.topSpacing-extra;
            if(scrollTop<=etse){
                if(s.currentTop!==null){
                    s.stickyElement.css("position","").css("top","").removeClass(s.elementClassName);
                    s.stickyElement.parent().removeClass(s.elementClassName);
                    s.currentTop=null
                }
            }else{
                var newTop=documentHeight-s.stickyElement.outerHeight()-s.topSpacing-s.bottomSpacing-scrollTop-extra;
                if(newTop<0)newTop=newTop+s.topSpacing;else newTop=s.topSpacing;
                if(s.currentTop!=newTop||forceRefresh==true){
                    s.stickyElement.css("position","fixed").css("top",
                        newTop).addClass(s.elementClassName);
                    s.stickyElement.parent().addClass(s.elementClassName);
                    s.currentTop=newTop
                }
            }
        }
    },resizer=function(){
        windowHeight=$window.height()
    },methods={
        init:function(options){
            var o=$.extend(defaults,options);
            return this.each(function(){
                var stickyElement=$(this);
                stickyId=stickyElement.attr("id");
                wrapper=$("<div></div>").attr("id",stickyId+"-sticky-wrapper").addClass(o.wrapperClassName);
                stickyElement.wrapAll(wrapper);
                var stickyWrapper=stickyElement.parent();
                stickyWrapper.css("height",
                    stickyElement.outerHeight());
                stickyElement.attr("data-position",stickyElement.css("position"));
                stickyElement.attr("data-top",stickyElement.css("top"));
                sticked.push({
                    topSpacing:o.topSpacing,
                    bottomSpacing:o.bottomSpacing,
                    stickyElement:stickyElement,
                    currentTop:null,
                    stickyWrapper:stickyWrapper,
                    elementClassName:o.elementClassName
                });
                scroller(true)
            })
        },
        destroy:function(options){
            var o=$.extend(defaults,options);
            return this.each(function(){
                var stickyElement=$(this);
                var stickyWrapper=stickyElement.parent();
                stickyElement.css("position",stickyElement.attr("data-position")).css("top",stickyElement.attr("data-top")).removeAttr("data-position").removeAttr("data-top").removeClass(o.elementClassName).unwrap();
                var elementsToRemove=[];
                for(var i=0;i<sticked.length;i++){
                    var s=sticked[i];
                    if(s.stickyElement.attr("id")===stickyElement.attr("id"))elementsToRemove.push(i)
                }
                for(var i=0;i<elementsToRemove.length;i++)sticked.splice(elementsToRemove[i],1);
                elementsToRemove=null
            })
        },
        update:scroller
    };

    if(window.addEventListener){
        window.addEventListener("scroll",
            scroller,false);
        window.addEventListener("resize",resizer,false)
    }else if(window.attachEvent){
        window.attachEvent("onscroll",scroller);
        window.attachEvent("onresize",resizer)
    }
    $.fn.sticky=function(method){
        if(methods[method])return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        else if(typeof method==="object"||!method)return methods.init.apply(this,arguments);else $.error("Method "+method+" does not exist on jQuery.sticky")
    };
        
    $(function(){
        setTimeout(scroller,0)
    })
})(jQuery);


/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
(function(d){
    d.flexslider=function(j,l){
        var a=d(j),c=d.extend({},d.flexslider.defaults,l),e=c.namespace,q="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,u=q?"touchend":"click",m="vertical"===c.direction,n=c.reverse,h=0<c.itemWidth,s="fade"===c.animation,t=""!==c.asNavFor,f={};
        
        d.data(j,"flexslider",a);
        f={
            init:function(){
                a.animating=!1;
                a.currentSlide=c.startAt;
                a.animatingTo=a.currentSlide;
                a.atEnd=0===a.currentSlide||a.currentSlide===a.last;
                a.containerSelector=c.selector.substr(0,
                    c.selector.search(" "));
                a.slides=d(c.selector,a);
                a.container=d(a.containerSelector,a);
                a.count=a.slides.length;
                a.syncExists=0<d(c.sync).length;
                "slide"===c.animation&&(c.animation="swing");
                a.prop=m?"top":"marginLeft";
                a.args={};
                
                a.manualPause=!1;
                var b=a,g;
                if(g=!c.video)if(g=!s)if(g=c.useCSS)a:{
                    g=document.createElement("div");
                    var p=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"],e;
                    for(e in p)if(void 0!==g.style[p[e]]){
                        a.pfx=p[e].replace("Perspective","").toLowerCase();
                        a.prop="-"+a.pfx+"-transform";
                        g=!0;
                        break a
                    }
                    g=!1
                }
                b.transitions=g;
                ""!==c.controlsContainer&&(a.controlsContainer=0<d(c.controlsContainer).length&&d(c.controlsContainer));
                ""!==c.manualControls&&(a.manualControls=0<d(c.manualControls).length&&d(c.manualControls));
                c.randomize&&(a.slides.sort(function(){
                    return Math.round(Math.random())-0.5
                }),a.container.empty().append(a.slides));
                a.doMath();
                t&&f.asNav.setup();
                a.setup("init");
                c.controlNav&&f.controlNav.setup();
                c.directionNav&&f.directionNav.setup();
                c.keyboard&&
                (1===d(a.containerSelector).length||c.multipleKeyboard)&&d(document).bind("keyup",function(b){
                    b=b.keyCode;
                    if(!a.animating&&(39===b||37===b))b=39===b?a.getTarget("next"):37===b?a.getTarget("prev"):!1,a.flexAnimate(b,c.pauseOnAction)
                });
                c.mousewheel&&a.bind("mousewheel",function(b,g){
                    b.preventDefault();
                    var d=0>g?a.getTarget("next"):a.getTarget("prev");
                    a.flexAnimate(d,c.pauseOnAction)
                });
                c.pausePlay&&f.pausePlay.setup();
                c.slideshow&&(c.pauseOnHover&&a.hover(function(){
                    !a.manualPlay&&!a.manualPause&&a.pause()
                },
                function(){
                    !a.manualPause&&!a.manualPlay&&a.play()
                }),0<c.initDelay?setTimeout(a.play,c.initDelay):a.play());
                q&&c.touch&&f.touch();
                (!s||s&&c.smoothHeight)&&d(window).bind("resize focus",f.resize);
                setTimeout(function(){
                    c.start(a)
                },200)
            },
            asNav:{
                setup:function(){
                    a.asNav=!0;
                    a.animatingTo=Math.floor(a.currentSlide/a.move);
                    a.currentItem=a.currentSlide;
                    a.slides.removeClass(e+"active-slide").eq(a.currentItem).addClass(e+"active-slide");
                    a.slides.click(function(b){
                        b.preventDefault();
                        b=d(this);
                        var g=b.index();
                        !d(c.asNavFor).data("flexslider").animating&&!b.hasClass("active")&&(a.direction=a.currentItem<g?"next":"prev",a.flexAnimate(g,c.pauseOnAction,!1,!0,!0))
                    })
                }
            },
            controlNav:{
                setup:function(){
                    a.manualControls?f.controlNav.setupManual():f.controlNav.setupPaging()
                },
                setupPaging:function(){
                    var b=1,g;
                    a.controlNavScaffold=d('<ol class="'+e+"control-nav "+e+("thumbnails"===c.controlNav?"control-thumbs":"control-paging")+'"></ol>');
                    if(1<a.pagingCount)for(var p=0;p<a.pagingCount;p++)g="thumbnails"===c.controlNav?
                        '<img src="'+a.slides.eq(p).attr("data-thumb")+'"/>':"<a>"+b+"</a>",a.controlNavScaffold.append("<li>"+g+"</li>"),b++;
                    a.controlsContainer?d(a.controlsContainer).append(a.controlNavScaffold):a.append(a.controlNavScaffold);
                    f.controlNav.set();
                    f.controlNav.active();
                    a.controlNavScaffold.delegate("a, img",u,function(b){
                        b.preventDefault();
                        b=d(this);
                        var g=a.controlNav.index(b);
                        b.hasClass(e+"active")||(a.direction=g>a.currentSlide?"next":"prev",a.flexAnimate(g,c.pauseOnAction))
                    });
                    q&&a.controlNavScaffold.delegate("a",
                        "click touchstart",function(a){
                            a.preventDefault()
                        })
                },
                setupManual:function(){
                    a.controlNav=a.manualControls;
                    f.controlNav.active();
                    a.controlNav.live(u,function(b){
                        b.preventDefault();
                        b=d(this);
                        var g=a.controlNav.index(b);
                        b.hasClass(e+"active")||(g>a.currentSlide?a.direction="next":a.direction="prev",a.flexAnimate(g,c.pauseOnAction))
                    });
                    q&&a.controlNav.live("click touchstart",function(a){
                        a.preventDefault()
                    })
                },
                set:function(){
                    a.controlNav=d("."+e+"control-nav li "+("thumbnails"===c.controlNav?"img":"a"),
                        a.controlsContainer?a.controlsContainer:a)
                },
                active:function(){
                    a.controlNav.removeClass(e+"active").eq(a.animatingTo).addClass(e+"active")
                },
                update:function(b,c){
                    1<a.pagingCount&&"add"===b?a.controlNavScaffold.append(d("<li><a>"+a.count+"</a></li>")):1===a.pagingCount?a.controlNavScaffold.find("li").remove():a.controlNav.eq(c).closest("li").remove();
                    f.controlNav.set();
                    1<a.pagingCount&&a.pagingCount!==a.controlNav.length?a.update(c,b):f.controlNav.active()
                }
            },
            directionNav:{
                setup:function(){
                    var b=d('<ul class="'+
                        e+'direction-nav"><li><a class="'+e+'prev" href="#">'+c.prevText+'</a></li><li><a class="'+e+'next" href="#">'+c.nextText+"</a></li></ul>");
                    a.controlsContainer?(d(a.controlsContainer).append(b),a.directionNav=d("."+e+"direction-nav li a",a.controlsContainer)):(a.append(b),a.directionNav=d("."+e+"direction-nav li a",a));
                    f.directionNav.update();
                    a.directionNav.bind(u,function(b){
                        b.preventDefault();
                        b=d(this).hasClass(e+"next")?a.getTarget("next"):a.getTarget("prev");
                        a.flexAnimate(b,c.pauseOnAction)
                    });
                    q&&a.directionNav.bind("click touchstart",function(a){
                        a.preventDefault()
                    })
                },
                update:function(){
                    var b=e+"disabled";
                    1===a.pagingCount?a.directionNav.addClass(b):c.animationLoop?a.directionNav.removeClass(b):0===a.animatingTo?a.directionNav.removeClass(b).filter("."+e+"prev").addClass(b):a.animatingTo===a.last?a.directionNav.removeClass(b).filter("."+e+"next").addClass(b):a.directionNav.removeClass(b)
                }
            },
            pausePlay:{
                setup:function(){
                    var b=d('<div class="'+e+'pauseplay"><a></a></div>');
                    a.controlsContainer?
                    (a.controlsContainer.append(b),a.pausePlay=d("."+e+"pauseplay a",a.controlsContainer)):(a.append(b),a.pausePlay=d("."+e+"pauseplay a",a));
                    f.pausePlay.update(c.slideshow?e+"pause":e+"play");
                    a.pausePlay.bind(u,function(b){
                        b.preventDefault();
                        d(this).hasClass(e+"pause")?(a.manualPause=!0,a.manualPlay=!1,a.pause()):(a.manualPause=!1,a.manualPlay=!0,a.play())
                    });
                    q&&a.pausePlay.bind("click touchstart",function(a){
                        a.preventDefault()
                    })
                },
                update:function(b){
                    "play"===b?a.pausePlay.removeClass(e+"pause").addClass(e+
                        "play").text(c.playText):a.pausePlay.removeClass(e+"play").addClass(e+"pause").text(c.pauseText)
                }
            },
            touch:function(){
                function b(b){
                    k=m?d-b.touches[0].pageY:d-b.touches[0].pageX;
                    q=m?Math.abs(k)<Math.abs(b.touches[0].pageX-e):Math.abs(k)<Math.abs(b.touches[0].pageY-e);
                    if(!q||500<Number(new Date)-l)b.preventDefault(),!s&&a.transitions&&(c.animationLoop||(k/=0===a.currentSlide&&0>k||a.currentSlide===a.last&&0<k?Math.abs(k)/r+2:1),a.setProps(f+k,"setTouch"))
                }
                function g(){
                    j.removeEventListener("touchmove",
                        b,!1);
                    if(a.animatingTo===a.currentSlide&&!q&&null!==k){
                        var h=n?-k:k,m=0<h?a.getTarget("next"):a.getTarget("prev");
                        a.canAdvance(m)&&(550>Number(new Date)-l&&50<Math.abs(h)||Math.abs(h)>r/2)?a.flexAnimate(m,c.pauseOnAction):s||a.flexAnimate(a.currentSlide,c.pauseOnAction,!0)
                    }
                    j.removeEventListener("touchend",g,!1);
                    f=k=e=d=null
                }
                var d,e,f,r,k,l,q=!1;
                j.addEventListener("touchstart",function(k){
                    a.animating?k.preventDefault():1===k.touches.length&&(a.pause(),r=m?a.h:a.w,l=Number(new Date),f=h&&n&&a.animatingTo===
                        a.last?0:h&&n?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:h&&a.currentSlide===a.last?a.limit:h?(a.itemW+c.itemMargin)*a.move*a.currentSlide:n?(a.last-a.currentSlide+a.cloneOffset)*r:(a.currentSlide+a.cloneOffset)*r,d=m?k.touches[0].pageY:k.touches[0].pageX,e=m?k.touches[0].pageX:k.touches[0].pageY,j.addEventListener("touchmove",b,!1),j.addEventListener("touchend",g,!1))
                },!1)
            },
            resize:function(){
                !a.animating&&a.is(":visible")&&(h||a.doMath(),s?f.smoothHeight():h?(a.slides.width(a.computedW),
                    a.update(a.pagingCount),a.setProps()):m?(a.viewport.height(a.h),a.setProps(a.h,"setTotal")):(c.smoothHeight&&f.smoothHeight(),a.newSlides.width(a.computedW),a.setProps(a.computedW,"setTotal")))
            },
            smoothHeight:function(b){
                if(!m||s){
                    var c=s?a:a.viewport;
                    b?c.animate({
                        height:a.slides.eq(a.animatingTo).height()
                    },b):c.height(a.slides.eq(a.animatingTo).height())
                }
            },
            sync:function(b){
                var g=d(c.sync).data("flexslider"),e=a.animatingTo;
                switch(b){
                    case "animate":
                        g.flexAnimate(e,c.pauseOnAction,!1,!0);
                        break;
                    case "play":
                        !g.playing&&
                        !g.asNav&&g.play();
                        break;
                    case "pause":
                        g.pause()
                }
            }
        };

        a.flexAnimate=function(b,g,p,j,l){
            t&&1===a.pagingCount&&(a.direction=a.currentItem<b?"next":"prev");
            if(!a.animating&&(a.canAdvance(b,l)||p)&&a.is(":visible")){
                if(t&&j)if(p=d(c.asNavFor).data("flexslider"),a.atEnd=0===b||b===a.count-1,p.flexAnimate(b,!0,!1,!0,l),a.direction=a.currentItem<b?"next":"prev",p.direction=a.direction,Math.ceil((b+1)/a.visible)-1!==a.currentSlide&&0!==b)a.currentItem=b,a.slides.removeClass(e+"active-slide").eq(b).addClass(e+
                    "active-slide"),b=Math.floor(b/a.visible);else return a.currentItem=b,a.slides.removeClass(e+"active-slide").eq(b).addClass(e+"active-slide"),!1;
                a.animating=!0;
                a.animatingTo=b;
                c.before(a);
                g&&a.pause();
                a.syncExists&&!l&&f.sync("animate");
                c.controlNav&&f.controlNav.active();
                h||a.slides.removeClass(e+"active-slide").eq(b).addClass(e+"active-slide");
                a.atEnd=0===b||b===a.last;
                c.directionNav&&f.directionNav.update();
                b===a.last&&(c.end(a),c.animationLoop||a.pause());
                if(s)q?(a.slides.eq(a.currentSlide).css({
                    opacity:0,
                    zIndex:1
                }),a.slides.eq(b).css({
                    opacity:1,
                    zIndex:2
                }),a.slides.unbind("webkitTransitionEnd transitionend"),a.slides.eq(a.currentSlide).bind("webkitTransitionEnd transitionend",function(){
                    c.after(a)
                }),a.animating=!1,a.currentSlide=a.animatingTo):(a.slides.eq(a.currentSlide).fadeOut(c.animationSpeed,c.easing),a.slides.eq(b).fadeIn(c.animationSpeed,c.easing,a.wrapup));
                else{
                    var r=m?a.slides.filter(":first").height():a.computedW;
                    h?(b=c.itemWidth>a.w?2*c.itemMargin:c.itemMargin,b=(a.itemW+b)*a.move*a.animatingTo,
                        b=b>a.limit&&1!==a.visible?a.limit:b):b=0===a.currentSlide&&b===a.count-1&&c.animationLoop&&"next"!==a.direction?n?(a.count+a.cloneOffset)*r:0:a.currentSlide===a.last&&0===b&&c.animationLoop&&"prev"!==a.direction?n?0:(a.count+1)*r:n?(a.count-1-b+a.cloneOffset)*r:(b+a.cloneOffset)*r;
                    a.setProps(b,"",c.animationSpeed);
                    if(a.transitions){
                        if(!c.animationLoop||!a.atEnd)a.animating=!1,a.currentSlide=a.animatingTo;
                        a.container.unbind("webkitTransitionEnd transitionend");
                        a.container.bind("webkitTransitionEnd transitionend",
                            function(){
                                a.wrapup(r)
                            })
                    }else a.container.animate(a.args,c.animationSpeed,c.easing,function(){
                        a.wrapup(r)
                    })
                }
                c.smoothHeight&&f.smoothHeight(c.animationSpeed)
            }
        };

        a.wrapup=function(b){
            !s&&!h&&(0===a.currentSlide&&a.animatingTo===a.last&&c.animationLoop?a.setProps(b,"jumpEnd"):a.currentSlide===a.last&&(0===a.animatingTo&&c.animationLoop)&&a.setProps(b,"jumpStart"));
            a.animating=!1;
            a.currentSlide=a.animatingTo;
            c.after(a)
        };
    
        a.animateSlides=function(){
            a.animating||a.flexAnimate(a.getTarget("next"))
        };
    
        a.pause=
        function(){
            clearInterval(a.animatedSlides);
            a.playing=!1;
            c.pausePlay&&f.pausePlay.update("play");
            a.syncExists&&f.sync("pause")
        };
    
        a.play=function(){
            a.animatedSlides=setInterval(a.animateSlides,c.slideshowSpeed);
            a.playing=!0;
            c.pausePlay&&f.pausePlay.update("pause");
            a.syncExists&&f.sync("play")
        };
    
        a.canAdvance=function(b,g){
            var d=t?a.pagingCount-1:a.last;
            return g?!0:t&&a.currentItem===a.count-1&&0===b&&"prev"===a.direction?!0:t&&0===a.currentItem&&b===a.pagingCount-1&&"next"!==a.direction?!1:b===a.currentSlide&&
            !t?!1:c.animationLoop?!0:a.atEnd&&0===a.currentSlide&&b===d&&"next"!==a.direction?!1:a.atEnd&&a.currentSlide===d&&0===b&&"next"===a.direction?!1:!0
        };
    
        a.getTarget=function(b){
            a.direction=b;
            return"next"===b?a.currentSlide===a.last?0:a.currentSlide+1:0===a.currentSlide?a.last:a.currentSlide-1
        };
    
        a.setProps=function(b,g,d){
            var e,f=b?b:(a.itemW+c.itemMargin)*a.move*a.animatingTo;
            e=-1*function(){
                if(h)return"setTouch"===g?b:n&&a.animatingTo===a.last?0:n?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:a.animatingTo===
                    a.last?a.limit:f;
                switch(g){
                    case "setTotal":
                        return n?(a.count-1-a.currentSlide+a.cloneOffset)*b:(a.currentSlide+a.cloneOffset)*b;
                    case "setTouch":
                        return b;
                    case "jumpEnd":
                        return n?b:a.count*b;
                    case "jumpStart":
                        return n?a.count*b:b;
                    default:
                        return b
                }
            }()+"px";
            a.transitions&&(e=m?"translate3d(0,"+e+",0)":"translate3d("+e+",0,0)",d=void 0!==d?d/1E3+"s":"0s",a.container.css("-"+a.pfx+"-transition-duration",d));
            a.args[a.prop]=e;
            (a.transitions||void 0===d)&&a.container.css(a.args)
        };

        a.setup=function(b){
            if(s)a.slides.css({
                width:"100%",
                "float":"left",
                marginRight:"-100%",
                position:"relative"
            }),"init"===b&&(q?a.slides.css({
                opacity:0,
                display:"block",
                webkitTransition:"opacity "+c.animationSpeed/1E3+"s ease",
                zIndex:1
            }).eq(a.currentSlide).css({
                opacity:1,
                zIndex:2
            }):a.slides.eq(a.currentSlide).fadeIn(c.animationSpeed,c.easing)),c.smoothHeight&&f.smoothHeight();
            else{
                var g,p;
                "init"===b&&(a.viewport=d('<div class="'+e+'viewport"></div>').css({
                    overflow:"hidden",
                    position:"relative"
                }).appendTo(a).append(a.container),a.cloneCount=0,a.cloneOffset=
                    0,n&&(p=d.makeArray(a.slides).reverse(),a.slides=d(p),a.container.empty().append(a.slides)));
                c.animationLoop&&!h&&(a.cloneCount=2,a.cloneOffset=1,"init"!==b&&a.container.find(".clone").remove(),a.container.append(a.slides.first().clone().addClass("clone")).prepend(a.slides.last().clone().addClass("clone")));
                a.newSlides=d(c.selector,a);
                g=n?a.count-1-a.currentSlide+a.cloneOffset:a.currentSlide+a.cloneOffset;
                m&&!h?(a.container.height(200*(a.count+a.cloneCount)+"%").css("position","absolute").width("100%"),
                    setTimeout(function(){
                        a.newSlides.css({
                            display:"block"
                        });
                        a.doMath();
                        a.viewport.height(a.h);
                        a.setProps(g*a.h,"init")
                    },"init"===b?100:0)):(a.container.width(200*(a.count+a.cloneCount)+"%"),a.setProps(g*a.computedW,"init"),setTimeout(function(){
                    a.doMath();
                    a.newSlides.css({
                        width:a.computedW,
                        "float":"left",
                        display:"block"
                    });
                    c.smoothHeight&&f.smoothHeight()
                },"init"===b?100:0))
            }
            h||a.slides.removeClass(e+"active-slide").eq(a.currentSlide).addClass(e+"active-slide")
        };
    
        a.doMath=function(){
            var b=a.slides.first(),
            d=c.itemMargin,e=c.minItems,f=c.maxItems;
            a.w=a.width();
            a.h=b.height();
            a.boxPadding=b.outerWidth()-b.width();
            h?(a.itemT=c.itemWidth+d,a.minW=e?e*a.itemT:a.w,a.maxW=f?f*a.itemT:a.w,a.itemW=a.minW>a.w?(a.w-d*e)/e:a.maxW<a.w?(a.w-d*f)/f:c.itemWidth>a.w?a.w:c.itemWidth,a.visible=Math.floor(a.w/(a.itemW+d)),a.move=0<c.move&&c.move<a.visible?c.move:a.visible,a.pagingCount=Math.ceil((a.count-a.visible)/a.move+1),a.last=a.pagingCount-1,a.limit=1===a.pagingCount?0:c.itemWidth>a.w?(a.itemW+2*d)*a.count-a.w-
                d:(a.itemW+d)*a.count-a.w-d):(a.itemW=a.w,a.pagingCount=a.count,a.last=a.count-1);
            a.computedW=a.itemW-a.boxPadding
        };
    
        a.update=function(b,d){
            a.doMath();
            h||(b<a.currentSlide?a.currentSlide+=1:b<=a.currentSlide&&0!==b&&(a.currentSlide-=1),a.animatingTo=a.currentSlide);
            if(c.controlNav&&!a.manualControls)if("add"===d&&!h||a.pagingCount>a.controlNav.length)f.controlNav.update("add");
                else if("remove"===d&&!h||a.pagingCount<a.controlNav.length)h&&a.currentSlide>a.last&&(a.currentSlide-=1,a.animatingTo-=1),
                    f.controlNav.update("remove",a.last);
            c.directionNav&&f.directionNav.update()
        };
    
        a.addSlide=function(b,e){
            var f=d(b);
            a.count+=1;
            a.last=a.count-1;
            m&&n?void 0!==e?a.slides.eq(a.count-e).after(f):a.container.prepend(f):void 0!==e?a.slides.eq(e).before(f):a.container.append(f);
            a.update(e,"add");
            a.slides=d(c.selector+":not(.clone)",a);
            a.setup();
            c.added(a)
        };
    
        a.removeSlide=function(b){
            var e=isNaN(b)?a.slides.index(d(b)):b;
            a.count-=1;
            a.last=a.count-1;
            isNaN(b)?d(b,a.slides).remove():m&&n?a.slides.eq(a.last).remove():
            a.slides.eq(b).remove();
            a.doMath();
            a.update(e,"remove");
            a.slides=d(c.selector+":not(.clone)",a);
            a.setup();
            c.removed(a)
        };
    
        f.init()
    };

    d.flexslider.defaults={
        namespace:"flex-",
        selector:".slides > li",
        animation:"fade",
        easing:"swing",
        direction:"horizontal",
        reverse:!1,
        animationLoop:!0,
        smoothHeight:!1,
        startAt:0,
        slideshow:!0,
        slideshowSpeed:7E3,
        animationSpeed:600,
        initDelay:0,
        randomize:!1,
        pauseOnAction:!0,
        pauseOnHover:!1,
        useCSS:!0,
        touch:!0,
        video:!1,
        controlNav:!0,
        directionNav:!0,
        prevText:"Previous",
        nextText:"Next",
        keyboard:!0,
        multipleKeyboard:!1,
        mousewheel:!1,
        pausePlay:!1,
        pauseText:"Pause",
        playText:"Play",
        controlsContainer:"",
        manualControls:"",
        sync:"",
        asNavFor:"",
        itemWidth:0,
        itemMargin:0,
        minItems:0,
        maxItems:0,
        move:0,
        start:function(){},
        before:function(){},
        after:function(){},
        end:function(){},
        added:function(){},
        removed:function(){}
    };

    d.fn.flexslider=function(j){
        void 0===j&&(j={});
        if("object"===typeof j)return this.each(function(){
            var a=d(this),c=a.find(j.selector?j.selector:".slides > li");
            1===c.length?(c.fadeIn(400),
                j.start&&j.start(a)):void 0==a.data("flexslider")&&new d.flexslider(this,j)
        });
        var l=d(this).data("flexslider");
        switch(j){
            case "play":
                l.play();
                break;
            case "pause":
                l.pause();
                break;
            case "next":
                l.flexAnimate(l.getTarget("next"),!0);
                break;
            case "prev":case "previous":
                l.flexAnimate(l.getTarget("prev"),!0);
                break;
            default:
                "number"===typeof j&&l.flexAnimate(j,!0)
        }
    }
})(jQuery);