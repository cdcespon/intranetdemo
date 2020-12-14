var slider1 = null, currentSamplepage = undefined, slider2 = null, oldthemepath = null, SamplesList = null, editcontrolpath = null, selthemecolor = null, cssheight = null; window.theme = "azure", minScrollerHeight = 550;
window.themecolor = ""; window.themestyle = ""; window.themevarient = "", removeGroup = false;
isPopupOpened = false;
window.portNumber = 3228;
window.isIISInstalled = false;
window.isMac = function () {
    return (/(ipad|iphone|ipod touch)/i).test(navigator.userAgent.toLowerCase()) && !(/trident|windows phone/i.test(navigator.userAgent.toLowerCase()));
}
_isAndroid = function () {
    return ((/android/i.test(navigator.userAgent.toLowerCase())) && !this.isWindows());
}
isDevice = ej.isDevice() && ej.isTouchDevice();
window.baseurl = "http://js.syncfusion.com/ejServices/";
$(function () {
    function iOSversion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
    }
    iosVer = iOSversion();
    iosVersion = 84;
    isIosVersion8_4 = ej.isDevice() && iosVer != undefined && iosVersion == "" + iosVer[0] + iosVer[1];
    window.isTransitionSupported = "transition" in document.body.style;
    var sbModel = new ViewModel(), isloadLeft = false;
    if (!window.isMac()) window.baseurl = window.baseurl + portNumber;
    else
        $(".htmljssamplebrowser").addClass("mac");
    $(".htmljssamplebrowser").addClass("azure");
    if (isDevice || window.innerWidth < 480) $(".htmljssamplebrowser").addClass("mobile");
    bindUnbindDocClickEvents(true);
   
    window.Path && Path.map("#!/:theme/:control(/:category1)(/:category2)(/:category3)").to(function () {
        var control = "", categories = [], currentSample, theme = "";
        for (var prop in this.params) {
            if (prop === "theme") {
                window.theme = this.params[prop];
                continue;
            }
            else if (prop === "control") {
                control = this.params[prop];
                continue;
            }
            categories.push(this.params[prop]);
        }

        if (window.theme.indexOf("dark") != -1)
            $(document.body).addClass("darktheme");

        currentSample = categories.pop();
        try {
            currentSample = decodeURIComponent(currentSample)
        }
        catch (e) {
            currentSample = encodeURIComponent(currentSample);
            currentSample = decodeURIComponent(currentSample);
        }
        if (control !== "")
            loadSamplePage(control, currentSample, categories);
        updateSBTheme();
    });
    $.views.converters("ensureURL", function (val) {
        return val.toLowerCase();
    });
    $.views.converters("Upperstring", function (val) {
        return val.toUpperCase();
    });
    $.views.converters("RemoveWhiteSpace", function (val) {
        return val.replace(/ /g, "");
    });
    var updateSBTheme = function () {
        $("#res_themebutton >li >a > .e-icon:first").removeClass('lime').removeClass('azure').removeClass('saffron').removeClass('high-contrast-01').removeClass('high-contrast-02').removeClass('material').removeClass('office-365');
        $("#themebutton >li >a > .e-icon:first").removeClass('lime').removeClass('azure').removeClass('saffron').removeClass('high-contrast-01').removeClass('high-contrast-02').removeClass('material').removeClass('office-365');
        if (window.location.hash.indexOf("lime") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "lime");
            $("#res_themebutton >li >a > .e-icon:first").addClass("lime");
            $("#themebutton >li >a > .e-icon:first").addClass("lime");
        }
        else if (window.location.hash.indexOf("saffron") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "saffron");
            $("#res_themebutton >li >a > .e-icon:first").addClass("saffron");
            $("#themebutton >li >a > .e-icon:first").addClass("saffron");
        }
        else if (window.location.hash.indexOf("bootstrap") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "azure");
            $("#res_themebutton >li >a > .e-icon:first").addClass("azure");
            $("#themebutton >li >a > .e-icon:first").addClass("azure");
        }
        else if (window.location.hash.indexOf("high-contrast-01") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "high-contrast-01");
            $("#res_themebutton >li >a > .e-icon:first").addClass("high-contrast-01");
            $("#themebutton >li >a > .e-icon:first").addClass("high-contrast-01");
        }
        else if (window.location.hash.indexOf("high-contrast-02") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "high-contrast-02");
            $("#res_themebutton >li >a > .e-icon:first").addClass("high-contrast-02");
            $("#themebutton >li >a > .e-icon:first").addClass("high-contrast-02");
        }
        else if (window.location.hash.indexOf("material") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "material");
            $("#res_themebutton >li >a > .e-icon:first").addClass("material");
            $("#themebutton >li >a > .e-icon:first").addClass("material");
        }
        else if (window.location.hash.indexOf("office-365") != -1) {
            $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + "office-365");
            $("#res_themebutton >li >a > .e-icon:first").addClass("office-365");
            $("#themebutton >li >a > .e-icon:first").addClass("office-365");
        }
        else {
            $("#res_themebutton >li >a > .e-icon:first").addClass("azure");
            $("#themebutton >li >a > .e-icon:first").addClass("azure");
        }
    };

    var loadSamplePage = function (control, currentSample, categories) {
        if (isDevice || window.innerWidth < 480) $(".htmljssamplebrowser").addClass("mobile");
        if (ej.isNullOrUndefined(control)) {
            $("#samplesDiv").css("display", "none");
            $(".samples").css("display", "none");
            $("sameplefile").css("visibility", "hidden")
            $("#samplefile").attr('src', 'about:blank');
            self.loadSBMainPage(null);
            bindUnbindDocClickEvents(true);
            document.title = "Essential Studio for JavaScript";
            return;
        }
        else
            samplelisthide();
        var sample = findSample(control, currentSample, categories), name = sample, parentId = null;

        while (name.samples) {
            if (name.samples) {
                parentId = parseInt(name.id) ? name.id : null;
                window.sample = name = name.samples[0];
                currentSample = name.querystring;
            } else
                break;
        }

        self.removeSelectedItemcss(control, name.id);

        if ($("#sbtooltipbox").data("ejDialog"))
            $("#sbtooltipbox").ejDialog("close");

        if (isloadLeft || Number(name.id) <= 1)
            self.loadLeftTab(control, currentSample);
        if (control == "angularsupport" || control == "knockout") var sampleurl = currentSample + "/" + control + ".html";
        else var sampleurl = control + "/" + currentSample + ".html";
        self.loadSamplePage(sampleurl, control, currentSample, parentId, name.id);
        $(".sample_wrapper").show().css("min-height", window.innerHeight - $(".header").height() - 10 + "px");
        $('.control_ref').removeClass('hidepage');
        $('#ref_document').attr('href', sample.ugurl ? sample.ugurl : 'http://help.syncfusion.com/js');
        $('#ref_forums').attr('href', sample.forumurl ? sample.forumurl : 'https://www.syncfusion.com/forums/javascript');
        $('#ref_kb').attr('href', sample.kburl ? sample.kburl : 'https://www.syncfusion.com/kb/javascript');
        setTimeout("updateHeight()", 200);
    };

    var findSample = function (control, currentSample, categories) {
        var sample = ej.Query().using(ej.DataManager(SamplesList)).where("id", "==", control, true), current = sample, res;

        for (var k = 0; k < categories.length; k++) {
            current.hierarchy((current = ej.Query("samples").where("url", "==", categories[k], true)));
        }

        if (currentSample)
            current.hierarchy(ej.Query("samples").where("url", "==", currentSample, true));

        res = sample.executeLocal();

        if (res.length) res = res[0];
        return res;
    };
    $("#Res-prodnav").on("click", function (e) {
        if ($(window).width() < 900) {
            $(".product-naviation").toggleClass("hideIt");
            $(".product-naviation").css("margin-left", ($(window).width() - 170));
        }
        isPopupOpened = isPopupOpened ? isPopupOpened : !$(".product-naviation").hasClass("hideIt");
        bindUnbindDocClickEvents(isPopupOpened);
        e.stopPropagation();
    });
    $("#scrollcontainer").on("click", ".secondlevelload, .anchorclass", function (e) {
        var hashBang = $(e.currentTarget).attr("hashbang");
        if (hashBang) {
            var path = hashBang.replace("flat", window.theme);
            if (path != window.location.hash) {
                $('#samplefile').css('visibility', 'hidden');
                $('#sourceTab').css('visibility', 'hidden');
                $("#edit-wrapper span.e-icon").css('visibility', 'hidden');

            }
            window.location.hash = path;
            if (!isDevice && $(e.target).closest(".anchorclass.mainlevel").length == 1)
                setTimeout(function () { $("#scrollcontainer").ejScroller({ scrollTop: 0 }); }, 100);
        }
        var viewportWidth = $(window).width();
    });
    $("#slideMenu").ejButton({
        size: "mini",
        width: "36px",
        height: "36px",
        cssClass: "metroblue",
        contentType: "imageonly",
        prefixIcon: "slidepanel-nav",
        showRoundedCorner: true
    });
    var browser = navigator.userAgent.match(/(msie) ([\w.]+)/i);
    $("#themebutton").ejMenu({
        fields: { dataSource: menuData },
        openOnClick: true,
        width: 62,
        cssClass: "e-custom-theme",
        click: "themebtnClick"
    });

    resizeMenu = function () {
        menu = window.innerWidth < 981 ? $("#res_themebutton ul") : $("#themebutton ul");
        menu.css("overflow-y", "auto");
        var height = window.innerHeight - $(".header").outerHeight();
        height > 520 ? menu.height("auto") : menu.height(height - 55);
    }

    $("#res_themebutton").ejMenu({
        fields: { dataSource: menuData },
        openOnClick: true,
        width: 35,
        cssClass: "e-custom-theme",
        click: "themebtnClick"
    });
    $(".sample_wrapper:visible").css("min-height", window.innerHeight - $(".header").height() - 10 + "px");
    resizeMenu();
    resMenu_obj = $("#res_themebutton").data("ejMenu");
    $("#res_themebutton >li >a > .e-icon:first").addClass("azure");
    $("#themebutton >li >a > .e-icon:first").addClass("azure");
    if (!ej.isNullOrUndefined(browser) && browser[1].toLowerCase() == "msie" && browser[2] == 8) $(".res_header .e-custom-theme").addClass('e-hide');
    $("#buybutton").ejButton({
        size: "normal",
        width: "45px",
        height: "55px",
        cssClass: "metroblue",
        contentType: "imageonly",
        prefixIcon: "e-uiLight e-icon-handup"
    });

    $("#themestudio").ejButton({
        size: "normal",
        width: 165,
        height: 30,
        cssClass: "themestudio",
        showRoundedCorner: true,
        prefixIcon: "themestudio-logo",
        contentType: "textandimage",
    });


    $(".product-naviation div").on("click", function (e) {
        var navText = e.target.textContent || e.target.innerText;
        viewdemo(navText);
        $(".productlogo").removeClass().addClass("productlogo");
        $(".productlogo").addClass(navText.toLowerCase() + "logo");
    });
    $("#sbtooltipbox").ejDialog({ height: "86px", width: "176px", enableResize: false, showOnInit: false, showHeader: false, cssClass: "metroblue", allowKeyboardNavigation: false });
    $("#themeDialog").ejDialog({ height: "160px", enableResize: false, showOnInit: false, showHeader: false, cssClass: "metroblue" });
    themeButtonSelect();
    var eleID = (window.themestyle == "" ? "flat" : window.themestyle) + window.themecolor + (window.themevarient != "light" ? window.themevarient : "");
    var menuObj = $("#themebutton").ejMenu('instance');
    var hiddenMenuObj = $("#themebutton").ejMenu('instance');
    jQuery.each(menuObj.element.find('li.e-list'), function (i, val) {
        if ($(val).attr('id') === eleID) $(val).addClass('e-active');
    });
    jQuery.each(hiddenMenuObj.element.find('li.e-list'), function (i, val) {
        if ($(val).attr('id') === eleID) $(val).addClass('e-active');
    });
    var metroradio = $("#JobSearch").data("ejMenu");
    var firstlevelsamples = [];

    var isContentPageLoaded = null;
    var index = 0;

    function editItem(id, back) {
        var divid = id;
        self.removeSelectedItemcss();
        url = window.location.pathname;
        $("#subsamplesDiv").hide().css("left", "250px");
        //After the sample page load footer will be loaded.
        $("#footer").hide();
        $(".cols-iframe,#sourceTab, .sample_wrapper").hide();
        window.location.hash = "" + "#!/" + window.theme;
        loadSamplePage();
        setTimeout(function () {
            if (!isDevice) {
                refreshScroller();
                $("#scrollcontainer").ejScroller({ scrollTop: 0 });
            }
            else
                $("#scrollcontainer").css({ "height": window.innerHeight - $("#scrollcontainer").offset().top, "overflow-y": "auto" });
            if (isTransitionSupported) $(".accordion-panel").css("left", "0px");
            else $(".accordion-panel").animate({ "left": "0px" }, 350);
            $("#footer").show();
        }, 200);
    }
    function ViewModel() {
        this.Controls = SamplesList;
        this.controlname = "";
        this.controlName = null;
        this.sampleName = null;

        self.editSubItem = function (id, back) {
            var divid = id;
            removeSelectedItemcss();
            $("#subsamplesDiv").html('');
            $("#" + divid).css("margin-top", "0px");
            $("#subsamplesDiv").hide().css("left", "250px");
            $("#samplesDiv").css("left", "0px").show();
            $("#" + divid).show().css("visibility", "visible");
            $("#" + divid + "_back").addClass("dashboarddiv");
            $("#" + divid).children(".subsamples").find("a >div").removeClass("dashboardhover");
            $("#samplesDiv").find("#" + divid).css("left", "-250px");
            $("#samplesDiv").find("#" + divid).children(".subsamples").show();
            $("#samplesDiv").find("#" + divid).animate({ left: '0px' }, 200);
            var samplename = null, controlname = null;
            //var scroller = $("#scrollcontainer").data("ejScroller");
            //scroller.setModel({ cssClass: "metroblue" });
            //scroller.refresh();
            window.location.hash = window.location.hash.replace(/(#!\/[^\/]+)\/.+/, "$1");
            window.location.hash = window.location.hash + "/" + divid;
            refreshScroller();
        };

        self.loadLeftTab = function (divid) {
            if ($("#" + divid).prev().length > 0) {
                $("#" + divid).css("margin-top", "0px");
            }
            $("#accordion2").css("left", "-250px");
            $("#accordion2").prev().css("display", "none");
            $("#accordion2").css("display", "none");
            $("#subsamplesDiv").css("display", "none");
            $(".samples").hide();
            $("#samplesDiv").children("#" + divid).css("display", "block");
            $("#samplesDiv").children("#" + divid).children(".subsamples").show();
            $("#samplesDiv").children("#" + divid).children(".subsamples").find("#subControls").hide();
            $("#" + divid + "_back").css("display", "block");
            $("#" + divid + "_header").css("display", "block");
            $("#samplesDiv").css("display", "block");
            $("#samplesDiv").css("margin-top", "0px");
            $("#samplesDiv").animate({ left: '0px' }, 0);
            $('html, body').animate({
                scrollTop: 0
            }, 0);
            //code for hiding subheaders
            if ($("#currentheader").length > 0)
                $("#currentheader").remove();
            var element = $("#" + divid + "_back").clone();
            $(element).appendTo("#dashboardheader").attr("id", "currentheader");
            $("#sbdashboard").hide();
            if ($("#dashboardheader .current_control").length > 0)
                $("#dashboardheader .current_control").remove();
            $($("#" + divid + "_header").clone()).insertAfter("#currentheader").addClass("current_control").attr("id", "current_control");
            $("#" + divid + "_header").hide();
            $("#" + divid + "_back").hide();
            refreshScroller();
        };


        self.findSample = function (ctrlname, samplename, subchild, currentsampleid) {
            var query = ej.Query().using(ej.DataManager(SamplesList))
                .where("id", "==", ctrlname), curr = query, res;

            if (subchild)
                query.hierarchy(
                    curr = ej.Query("samples")
                        .where("id", "==", subchild));

            curr.hierarchy(
                ej.Query("samples")
                    .where("id", "==", currentsampleid)
            );

            res = query.executeLocal();

            if (res.length) res = res[0];
            return res;

        },
        self.loadSamplePage = function (url, ctrlname, samplename, subchild, currentsampleid) {
            currentSamplepage = url;
            if ($("#auto").data("ejAutocomplete"))
                $("#auto").ejAutocomplete("clearText");
            if (!$('body').hasClass('fixedlayout')) $('body').addClass('fixedlayout');
            $(".sampleheadingtext").empty();
            var sample = self.findSample(ctrlname, samplename, subchild, currentsampleid), sampleTitle = "";

            while (sample) {
                if (sampleTitle)
                    sampleTitle += " / ";

                sampleTitle += sample.name;

                sample = sample.samples && sample.samples[0];
            }

            var names = sampleTitle.split("/"), _samplename = names.pop();
            sampleTitle = names.join("/") + "/ ";
            var sampletitleobj = ej.buildTag("div.samplename sbsamplename");
            ej.buildTag("span.controlname", sampleTitle).appendTo(sampletitleobj);
            ej.buildTag("span.sbtxt " + window.themecolor, _samplename).appendTo(sampletitleobj);
            var navigation = ej.buildTag("span.navigation-btn");
            ej.buildTag("a#newsamplewindow", {}, {}, { title: "New Window", target: "_blank" }).appendTo(navigation);
            $("<div>").addClass("windsep").appendTo(navigation);
            var prevState = ej.buildTag("span.prev", "Prev", {}, { title: "Previous" }).appendTo(navigation);
            var nextstate = ej.buildTag("span.next", "Next ", {}, { title: "Next" }).appendTo(navigation);
            navigation.appendTo(sampletitleobj);
            $(".res_header .sampleheadingtext:first").html(sampletitleobj);
            editcontrolpath = ctrlname + "/" + samplename + ".html";
            document.title = "Essential Studio for JavaScript : " + sampleTitle.replace(/\//g, "-") + " Demo";
            index = 0;
            self.setVisibility("productpage", "cols-iframe");
            $(".res_header .producttitle").hide();
            $(".res_header .sampleheadingtext").show();
            //Waiting popoup template
            $(".control-panel").ejWaitingPopup({ template: $("#sbwaitingTemplate") });
            var popupObj = $(".control-panel").ejWaitingPopup("instance");
            popupObj.maindiv.addClass("sbloadingpopup");
            popupObj.maindiv.find('.sbloadingtemplate').addClass(themecolor);
            isIosVersion8_4 ? "" : popupObj.show();
            autoResize("samplefile");
            $(".sourcecodetab").hide();
            $(".prev").ejButton({
                size: "mini",
                cssClass: "metroblue",
                contentType: "imageonly",
                prefixIcon: "e-rarrowleft-2x"
            });
            $(".next").ejButton({
                size: "mini",
                cssClass: "metroblue",
                contentType: "imageonly",
                prefixIcon: "e-rarrowright-2x"
            });
            $("#newsamplewindow").ejButton({
                size: "mini",
                cssClass: "metroblue",
                contentType: "imageonly",
                prefixIcon: "newwindow "
            });

            if (window.theme != "flat")
                url = url + "?theme=" + window.theme;
            $("#samplefile").attr('src', url);
            $("#samplefile")[0].contentWindow.focus();
            $("#newsamplewindow").attr('href', currentSamplepage);

            var curr;
            if (curr = ($("#samplesDiv").children("#" + ctrlname).find("div[querystring=" + samplename + "]"))) {
                $("#samplesDiv").children("#" + ctrlname).find("div[querystring=" + samplename + "]").children('span.anchor').addClass("itemselected");
                $("#samplesDiv").children("#" + ctrlname).find("div[querystring=" + samplename + "]").addClass("highlighttextbg");
                $("#samplesDiv").children("#" + ctrlname).find("div[querystring=" + samplename + "]").addClass("selecteddashboard");
            }
            var currentname = ctrlname;
            var currentfile = samplename;
            var currFile = $('.samples .anchorclass .itemselected').parent('.firstlevelload').parent('.anchorclass');
            var currFileParent = $(currFile).parents('div');
            var subFile = $('.samples .anchorclass .itemselected').parents('.secondlevelload');
            var subFileParent = $('.samples .anchorclass .itemselected').parents('.secondlevelload').parents('.anchorclass');
            $('span.prev').bind('click', function (evt, args) {
                var index = $("#samplesDiv .SB-hashcollection").index($("#samplesDiv .highlighttextbg").parent());
                if (index > 0) {
                    $('#samplefile').css('visibility', 'hidden');
                    $('#sourceTab').css('visibility', 'hidden');
                    $("#edit-wrapper span.e-icon").css('visibility', 'hidden');
                    var hashBang = $($("#samplesDiv .SB-hashcollection")[index - 1]).attr("hashbang");
                    queryChange(hashBang);
                }
            });

            $('span.next').bind('click', function (evt, args) {
                var index = $("#samplesDiv .SB-hashcollection").index($("#samplesDiv .highlighttextbg").parent());
                if (index < $("#samplesDiv .SB-hashcollection").length - 1) {
                    $('#samplefile').css('visibility', 'hidden');
                    $('#sourceTab').css('visibility', 'hidden');
                    $("#edit-wrapper span.e-icon").css('visibility', 'hidden');
                    var hashBang = $($("#samplesDiv .SB-hashcollection")[index + 1]).attr("hashbang")
                    queryChange(hashBang);
                }
            });
            if (!isDevice && $(".highlighttextbg.selecteddashboard").length == 1 && $(".highlighttextbg.selecteddashboard")[0].offsetTop >= 0) {
                var scrollercontrol = $("#scrollcontainer").ejScroller("instance");
                scrollercontrol.model.scrollTop = $(".highlighttextbg.selecteddashboard")[0].offsetTop;
                scrollercontrol.refresh();
            }
        };



        self.loadSBMainPage = function (divid) {
            $(".samplesection").hide();
            $('.control_ref').addClass('hidepage');
            if (divid != null) {
                $("#" + divid).css("visibility", "hidden");
                $("#" + divid + "_back").css("display", "none");
            }
            //code for removing the firstlevelback and secondlevelback header. 
            $("#sbdashboard").show();
            if ($("#dashboardheader .firstlevelback"))
                $("#dashboardheader .firstlevelback").remove();

            if ($("#dashboardheader .current_control"))
                $("#dashboardheader .current_control").remove();
            self.loadSBPage(divid);
        };
        self.loadSBPage = function (divid) {
            $("#accordion2").prev().css("display", "block");
            $("#accordion2>a>.dashboardhover").removeClass("dashboardhover");
            $(".sourcecodetab").hide();
            if (divid != null)
                $("#" + divid).hide();
            $("#accordion2").show();
            $("#samplesDiv").css("left", "250px");
            $("#accordion2").animate({ left: 0 }, 200, function () {
                self.setVisibility("cols-iframe", "productpage");
                $(".res_header .sampleheadingtext").hide();
                $(".res_header .producttitle").show();
            });
            $('html, body').animate({
                scrollTop: 0
            }, 0);
        };
        var count = 0;
        self.loadSourceCodeTab = function (url) {
            window.htmlEditor = [];
            $.ajax({
                url: url,
                dataType: "html",
                success: function (data) {
                    $("#sourceTab").html('');
                    var ulTag = ej.buildTag('ul');
                    var liTag = ej.buildTag('li');
                    var aTag = ej.buildTag('a').attr({ "href": "#htmlpage" }).text(window.sample.name);

                    liTag.append(aTag);
                    ulTag.append(liTag);
                    var divTag = ej.buildTag("div#htmlpage");
                    $("#sourceTab").append(ulTag).append(divTag).show();
                    var content = data;
                    if (count > 0) {
                        var target = $('#sourceTab').data("ejTab");
                        target.destroy();
                    }
                    count++;
                    $(".sourcecodetab").show();
                    window.htmlEditor.push(CodeMirror.fromTextArea($("#htmlpage").val(content)[0], {
                        lineNumbers: false,
                        readOnly: true,
                        mode: "text/html"
                    }));
                    $("#htmlpage").next($(".CodeMirror")).appendTo("#htmlpage");
                    $("#sourceTab").ejTab({ cssClass: "metroblue", enableTabScroll: false })
                    if (window.themevarient.indexOf("dark") != -1)
                        replacebg(true);
                    $(".CodeMirror").each(function (i, obj) {
                        if (i > 0)
                            $(obj).remove();
                    });
                    $("#sourceTab .CodeMirror").find('textarea').attr('readonly', 'readonly');
                    $("<span>").attr("id", "edit-wrapper").appendTo($("#sourceTab .e-header"));
                    $("<button>").attr("id", "EditWindow").attr('title', 'Edit in JS Playground').appendTo($("#sourceTab #edit-wrapper"));
                    $("<button>").attr("id", "copyclipboard").attr('title', 'Copy').appendTo($("#sourceTab #edit-wrapper"));
                    $("<span id='copy-alert' class='hideEl'>Copied to Clipboard</span>").appendTo($("#sourceTab #edit-wrapper"));
                    $("#copy-alert").bind('oanimationend animationend webkitAnimationEnd', function () {
                        $("#copy-alert").removeClass("elementToFadeIn elementToFadeOut");
                    });
                    $("<div>").insertAfter($("#sourceTab")).attr("id", "clipboard");
                    $("<textarea>").attr("style", "display:none").attr("id", "copytextarea").appendTo($("#clipboard"));
                    if (window.sample.additionalTabs) {
                        setTimeout(function () { self.ensureAdditionalTab() }, 100);
                    }
                    $("#EditWindow").ejButton({
                        size: "small",
                        cssClass: "copyedit",
                        text: "Edit",
                        contentType: "textandimage",
                        prefixIcon: "e-icon newsrcwindow"
                    });
                    $("#copyclipboard").ejButton({
                        size: "small",
                        cssClass: "copyedit copycode",
                        text: "Copy",
                        contentType: "textandimage",
                        prefixIcon: "e-icon  copycodeicon"
                    });
                    initiateCopyHandler();
                }
            });
        };
        self.ensureAdditionalTab = function () {
            if (window.sample.additionalTabs.length > 0) {
                for (var i = 0; i < window.sample.additionalTabs.length; i++) {
                    $("#sourceTab").ejTab("addItem", "#" + window.sample.additionalTabs[i].displayName, window.sample.additionalTabs[i].displayName, 3);
                    var dataval = null, path = codeMirrorModes(window.sample.additionalTabs[i].filePath) == "text/x-csharp" ? "sourceCodehandler.ashx" : window.sample.additionalTabs[i].filePath;
                    if (path == "sourceCodehandler.ashx")
                        dataval = { 'url': window.sample.additionalTabs[i].filePath };
                    $.ajax({
                        url: path,
                        dataType: "html",
                        contentType: "application/json",
                        data: dataval,
                        success: function (data) {
                            var tabid, dataurl = $(this)[0].url, content = data;
                            dataurl = decodeURIComponent(dataurl).replace("sourceCodehandler.ashx?url=", "");
                            for (var i = 0; i < window.sample.additionalTabs.length; i++) {
                                if (window.sample.additionalTabs[i].filePath == dataurl) {
                                    tabid = window.sample.additionalTabs[i].displayName;
                                    break;
                                }
                            }
                            window.htmlEditor.push(CodeMirror.fromTextArea($("#" + tabid).val(content)[0], {
                                lineNumbers: false,
                                readOnly: true,
                                mode: codeMirrorModes(window.sample.additionalTabs[i].filePath)
                            }));
                            $("#" + tabid).parent().children(".CodeMirror").appendTo("#" + tabid);
                            $("#sourceTab .CodeMirror").find('textarea').attr('readonly', 'readonly');
                            initiateCopyHandler();
                        }
                    });
                }
            }
        };

        self.setVisibility = function (oldpage, newpage) {
            $("." + newpage).show();
            $("." + oldpage).hide();
        };
        this.getCssClass = function (item) {
            var value = Number(item.childcount);

            if (value >= 1) {
                return 'arrow';
            }
            return;
        };
        this.getCssVisibility = function (item) {
            var value = Number(item.id);

            if (value != 1) {
                return 'hideParent';
            }
            return 'dashboard';
        };
        self.removeSelectedItemcss = function (ctrlname, controlid) {
            var obj = $(".itemselected");
            obj.each(function () {
                $(obj).removeClass('itemselected');
                $(obj).parent().removeClass('highlighttextbg');
            });
            $(".selecteddashboard").removeClass("selecteddashboard");
        };
    }
    var Mainlist = [];

    $(GroupingList).each(function () {
        Mainlist[this.toString()] = [];
    });

    var samplesdetails = SamplesList;
    $(samplesdetails).each(function (index1, sampleslist) {
        if (sampleslist) {
            var smpls = {}, secsamples = [];
            smpls["id"] = sampleslist.id;
            smpls["name"] = sampleslist.name;
            smpls["type"] = sampleslist.type;
            smpls["url"] = SamplesList[index1]["url"] = sampleslist.querystring.split(" ").join("");
            smpls["publish"] = sampleslist.publish;
            smpls["isResponsive"] = sampleslist.isResponsive;
            $(sampleslist.samples).each(function (ind, subsampleslist) {
                if (subsampleslist) {
                    var subsmpls = {};
                    subsmpls["id"] = subsampleslist.id;
                    subsmpls["name"] = subsampleslist.name;
                    subsmpls["querystring"] = subsampleslist.querystring;
                    subsmpls["childcount"] = subsampleslist.childcount;
                    subsmpls["type"] = subsampleslist.type;
                    if (subsampleslist.publish)
                        subsmpls["publish"] = subsampleslist.publish;
                    else
                        subsmpls["publish"] = smpls["publish"];
                    if (subsampleslist.isResponsive)
                        subsmpls["isResponsive"] = subsampleslist.isResponsive;
                    else
                        subsmpls["isResponsive"] = smpls["isResponsive"];
                    subsmpls["url"] = SamplesList[index1].samples[ind]["url"] = subsampleslist.name.split(" ").join("");

                    if (subsampleslist.childcount == 1)
                        subsmpls["arrowclass"] = "arrow";
                    else
                        subsmpls["arrowclass"] = "";

                    $(subsampleslist.samples).each(function (j, thirdlist) {
                        if (thirdlist)
                            SamplesList[index1].samples[ind].samples[j]["url"] = thirdlist.name.split(" ").join("");
                    });
                    subsmpls["samples"] = subsampleslist.samples;
                    if (subsmpls["publish"] != 'online')
                        secsamples.push(subsmpls);
                }
            });
            smpls["samples"] = secsamples;
            var temp = this;
            $(GroupingList).each(function () {
                if (temp["Group"] == this.toString()) {
                    Mainlist[this.toString()].push(smpls);
                    return false;
                }
            });
        }
    });
    window.jsonline = ($.trim(window.location.host.toString()) == "js.syncfusion.com");
    $("#accordion2").html($("#accordionGroupTmpl").render(GroupingList));
    $(GroupingList).each(function () {
        var content = $("#accordionTmpl").render(Mainlist[this], { online: window.jsonline });
        if ($.trim(content) != "") {
            $(".SB-group." + this.toString().replace(/ /g, "")).html(content);
            $(Mainlist[this.toString()]).each(function () {
                firstlevelsamples.push(this);
            });
        }
        else
            $(".SB-group." + this.toString().replace(/ /g, "")).hide().prev().hide();
    });
    $("#samplesDiv").html($("#accordionTmplchild").render(firstlevelsamples, { online: window.jsonline }));
    if (!isDevice) $("#scrollcontainer").ejScroller({ buttonSize: 0, scrollerSize: 9 });
    else $("#scrollcontainer").css({ "height": window.innerHeight - $("#scrollcontainer").offset().top, "overflow-y": "auto" });

    $("#scrollcontainer .SB-groupIt").click(function (e) {
        if ($(this).hasClass("downArrow")) {
            $(this).next().hide(300, function () { refreshScroller() });
            $(this).removeClass("downArrow");
            $(this).addClass("rightArrow");
        }
        else {
            $(this).next().show(300, function () { refreshScroller() });
            $(this).removeClass("rightArrow");
            $(this).addClass("downArrow");
        }
        e.stopPropagation();
    });
    RefreshPoductNav();
    refreshScroller();
    refreshContentWindow();

    function refreshScroller() {
        if (!isDevice) {
            //scroller resize refresh
            $(".accordion-panel.cols-fixed-sidebar").height((($(window).height() - $(".sbheader").outerHeight())) + "px ;");
            var controlheight = $("#scrollcontainer").ejScroller("instance");
            var Minheight = ($(window).height()) - ($(".header").outerHeight() + $("#dashboardheader").outerHeight() + $(".accordion-panel .search").outerHeight());
            controlheight.model.height = Minheight;
            controlheight.refresh();
            $("#scrollcontainer .e-vhandle").addClass("e-box");
        }
    }
    function refreshContentWindow() {
        //resizing for content fluid width 
        $(".scrollit").height($(window).height() - $(".sbheader").outerHeight() - 15);
        $(".scrollit .row").css({ "min-height": $(window).height() - $(".sbheader").outerHeight() - $("#footer").outerHeight() - 15 });
    }

    $('.accordion-panel').on('click', 'div.firstlevelback', function (evt, args) {
        editItem(evt.currentTarget.id, 'back');
    });
    function RefreshPoductNav() {
        $(".header").removeClass("Mobile").removeClass("Desktop");
        if ($(window).width() > 899)
            $(".header").addClass("Desktop");
        else
            $(".header").addClass("Mobile");
    }
    $(".dashboard").mouseover(function () {
        if (!$(".vHandle").is(":visible")) {
            if (window.themevarient.indexOf("dark") != -1 && !$(this).hasClass("dark-highlighttextbg"))
                $(this).addClass("dark-dashboardhover");
            else
                $(this).addClass("dashboardhover");
        }
    });
    $(".slidemenuicon").click(function (args) {
        if (!isPopupOpened) bindUnbindDocClickEvents(true);
        isPopupOpened = true;
        resMenu_obj._closeAll();
        if (isTransitionSupported) $('.accordion-panel').css("left", "0px");
        else $(".accordion-panel").animate({ "left": "0px" }, 350);
        $('.control-panel.cols-content-fluid').removeClass('accordionHide').removeClass('center-flow');
        move = 0;
        refreshScroller();
        if (!removeGroup) {
            $(".accordion >.SB-group").each(function (i, item) {
                if (item.children.length == $(item).children(".irresponsive").length)
                    $(item.previousElementSibling).addClass("irresponsive");

            });
            removeGroup = true;
        }
        args.stopPropagation();
    });
    $("#samplefile").load(function (e) {
        $(document.getElementById("samplefile").contentWindow.document).click(function (e) {
            samplelisthide();
            if ($(".product-naviation").is(":visible")) $(".product-naviation").addClass("hideIt");
            if ($("#res_themebutton ul").is(":visible") || $("#themebutton ul").is(":visible")) {
                var resMenu_obj = window.innerWidth > 981 ? $("#themebutton").data("ejMenu") : $("#res_themebutton").data("ejMenu");
                resMenu_obj._closeAll();
            }
        });
    });

    $(".dashboard").click(function () {
        $(this).find(".anchor").addClass("itemselected");
        $(".dark-dashboard").hasClass("dark-highlighttextbg");
        $(".dark-dashboard").removeClass("dark-highlighttextbg");
        $(this).find(".itemselected").parent().addClass("highlighttextbg");

    });

    $(".dashboard").mouseout(function () {
        if ($(this).hasClass("dashboardhover"))
            $(this).removeClass("dashboardhover");
        else if ($(this).hasClass("dark-dashboardhover"))
            $(this).removeClass("dark-dashboardhover");
    });
    var collection = SamplesList;
    var subdata = [], i, j, k;

    for (i = 0; i < collection.length; i++) {
        if (!collection[i]) continue;
        if ((collection[i].publish == "online" && window.jsonline) || collection[i].publish != "online") {
            for (j = 0; j < collection[i].samples.length; j++) {
                if (!collection[i].samples[j]) continue;
                var properties = {}, len;
                var controlName = collection[i].id;
                if ((collection[i].samples[j].publish == "online" && window.jsonline) || collection[i].samples[j].publish != "online") {
                    if (!collection[i].samples[j].samples) {
                        properties["id"] = controlName + "/" + collection[i].samples[j].url;
                        properties["control"] = collection[i].name;
                        properties["text"] = collection[i].samples[j].name;
                        properties["data"] = collection[i].name + " " + collection[i].samples[j].name;
                        properties["isResponsive"] = collection[i].samples[j].isResponsive;
                        if (collection[i].isResponsive == "false") {
                            properties["isResponsive"] = "false";
                        }
                        subdata.push(properties);
                    }
                }
                if (collection[i].samples[j].childcount != "0") {
                    if (/msie 8.0/.test(navigator.userAgent.toLowerCase()))
                        len = collection[i].samples[j].samples.length - 1;
                    else
                        len = collection[i].samples[j].samples.length;
                    if (collection[i].samples[j].name == "Selection")
                        var s = true;
                    if ((collection[i].samples[j].publish == "online" && window.jsonline) || collection[i].samples[j].publish != "online") {
                        for (k = 0; k < len; k++) {
                            if (!collection[i].samples[j].samples[k]) continue;
                            var subprops = {};
                            var subcontrolName = collection[i].samples[j].url;
                            if ((collection[i].samples[j].samples[k].publish == "online" && window.jsonline) || collection[i].samples[j].samples[k].publish != "online") {
                                subprops["id"] = controlName + "/" + subcontrolName + "/" + collection[i].samples[j].samples[k].url;
                                subprops["control"] = collection[i].name;
                                subprops["text"] = collection[i].samples[j].name + "/" + collection[i].samples[j].samples[k].name;
                                subprops["data"] = collection[i].name + " " + collection[i].samples[j].name + "/" + collection[i].samples[j].samples[k].name;
                                subprops["isResponsive"] = collection[i].samples[j].isResponsive;
                                subdata.push(subprops);
                            }
                        }
                    }
                }
            }
        }
    }
    function navigationList() {
        $('#auto').ejAutocomplete({
            watermarkText: "Search here",
            showPopupButton: false,
            filterType: "Contains",
            dataSource: subdata,
            fields: { key: "id", text: "data" },
            width: "210px",
            popupHeight: "180px",
            template: '<div class="control_name ">${control}</div> <div class="control_samplename">${text}</div>',
            select: "onSelectSearchItem",
        });

        if ($(window).width() < 979) {
            searchObj = $("#auto").data("ejAutocomplete");
            OldData = searchObj.option("dataSource");
            var newData = $.grep(OldData, function (sample) {
                return sample.isResponsive != "false";
            });
            searchObj.option("dataSource", newData);
        }

        var autocompletScroller = $("#auto").data("ejAutocomplete").scrollerObj;
        autocompletScroller.model.buttonSize = 0;
        autocompletScroller.model.scrollerSize = 8;

        $(window).bind("resize", function (e) {
            setTimeout(function () { autoResize("samplefile") }, 0);
            var viewportWidth = $(window).width();
            refreshScroller();
            refreshContentWindow();
            RefreshPoductNav();
            if ($("#sbtooltipbox").ejDialog("isOpened")) $("#sbtooltipbox").ejDialog("close");
            if (isDevice) $("#scrollcontainer").css({ "height": window.innerHeight - $("#scrollcontainer").offset().top, "overflow-y": "auto" });
            resizeMenu();
            isDevice || window.innerWidth < 480 ? $(".htmljssamplebrowser").addClass("mobile") : $(".htmljssamplebrowser").removeClass("mobile")
            if (window.innerWidth >= 480)
                $("#copyclipboard .e-btntxt").text("Copy"); $("#newcodewindow .e-btntxt").text("New");
            samplelisthide();
            var popupObj = $(".control-panel").data("ejWaitingPopup");
            popupObj && popupObj.refresh();
        });
        $(window).on("orientationchange", function () {
            setTimeout(function () {
                $("#scrollcontainer").css({ "height": window.innerHeight - $("#scrollcontainer").offset().top, "overflow-y": "auto" });
                resizeMenu();
            }, _isAndroid() ? 250 : 0)
        });
        if (Path.match(window.location.hash)) {
            $("#sbtooltipbox").ejDialog("close");
            isloadLeft = true;
            // $(".cols-iframe").show();
            showTooltipbox();
        }
        //var heightval = (window.innerHeight || $(window).height()) - ($(".header").outerHeight() + 5 + $(".search").outerHeight());
        //if(heightval<minScrollerHeight)
        //    heightval = minScrollerHeight;
        //else
        //    heightval = heightval - $("#footer").outerHeight();
        //var scroller = $("#scrollcontainer").width(253).data("ejScroller");
        //scroller.setModel({ height: heightval, width: 0, cssClass: "metroblue" });
        //scroller.refresh();
    }
    if (isIosVersion8_4) setTimeout(function () { navigationList(); }, 1000);
    else navigationList();

    $(".editcode").click(function () {
        $("#sbeditcodedialog").ejDialog(
                {
                    enableModal: true,
                    showOnInit: false,
                    allowDraggable: false,
                    width: "98%",
                    height: "95%",
                    cssClass: "metroblue",
                    enableResize: false,
                    content: "iframe",
                    contentUrl: "editcode.html?" + editcontrolpath,
                    title: "LIVE EDIT",
                    close: "onClose"
                });
        $("#sbeditcodedialog").show();
        $("#sbeditcodedialog").ejDialog("open");
        $('html, body').animate({
            scrollTop: 0
        }, 0);
        $("#sbeditcodedialog iframe").bind("load", function () {
            $('.liveeditctrls').insertAfter($("#sbeditcodedialog_wrapper .e-dialog-title")).addClass("showliveeditctrls");
            $("#sbeditcodedialog_wrapper .liveeditctrls #cssarea").ejCheckBox({ cssClass: "metroblue", "change": "oncssareaShowHide" });
            $("#sbeditcodedialog .e-iframe").contents().find("#apply").insertAfter($('.liveeditctrls'));
        });
    });
    //var mouseHover = function () {
    //    $("#scrollcontainer").find(".vScroll").show().addClass("scrollhandlehover");
    //    $("#scrollcontainer").find(".vScroll").prev().addClass("scrollercontainer-content");
    //};

    //var mouseOut = function () {
    //    $("#scrollcontainer").find(".vScroll").hide().removeClass("scrollhandlehover");
    //    $("#scrollcontainer").find(".vScroll").prev().removeClass("scrollercontainer-content");
    //    $("#scrollcontainer").find(".content").addClass("scrollercontainer-content");
    //};

    //$("#scrollcontainer").bind("mouseover", mouseHover);
    //$("#scrollcontainer").bind("mouseout", mouseOut);
    //$("#scrollcontainer").on("mousedown", ".vHandle", function () {
    //    $("#scrollcontainer").unbind("mouseout", mouseOut);

    //    $(document).one("mouseup", function () {
    //        $("#scrollcontainer").bind("mouseout", mouseOut);
    //        $("#scrollcontainer").find(".vScroll").hide();
    //    });
    //});
    Path.listen();

    var QueryString = function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], pair[1]];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
        return query_string;
    }();
    ej.support.stableSort = false;
    if (window.innerWidth < 981 || isDevice) samplelisthide();
});

function bindUnbindDocClickEvents(isOpened) {
    if (!isOpened) $(document).unbind("click");
    else
        $(document).bind("click", function (evt) {
            if ($("#sbtooltipbox").ejDialog("isOpened"))
                $("#sbtooltipbox").ejDialog("close");
            $(".product-naviation").addClass("hideIt");
            if (evt.target.nodeName != "INPUT" && !$(evt.target).hasClass("sbheading") && !$(evt.target).parents(".accordion-panel").length)
                samplelisthide();
            var resMenu_obj = window.innerWidth > 981 ? $("#themebutton").data("ejMenu") : $("#res_themebutton").data("ejMenu");
            resMenu_obj._closeAll();
            if (!$(evt.target).hasClass("sbheading") && evt.target.nodeName != "INPUT")
                bindUnbindDocClickEvents(false);
            else
                isPopupOpened = true;
            isPopupOpened = false;
            evt.stopPropagation();
        });
}
function oncssareaShowHide(args) {
    if (args.isChecked) {
        if ($($("#ejcssarea .e-innerspan")[1]).hasClass("e-chk-inactive"))
            $($("#ejcssarea .e-innerspan")[1]).addClass("e-chk-active")

        $($("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-pane")[1]).show();
        $("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-bar").show();
        var cssheight = $($("#sbeditcodedialog .e-iframe").contents().find("#spliter1 .v-pane")[0]).css("height");
        $($("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-pane")[0]).css("height", cssheight);
    }
    else {
        $($("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-pane")[1]).hide();
        $("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-bar").hide();
        cssheight = $($("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-pane")[0]).css("height");
        $($("#sbeditcodedialog .e-iframe").contents().find("#spliter2 .v-pane")[0]).css("height", "100%");
    }
}
function refreshIFrameTheme() {
    if (currentSamplepage != undefined && !$("#sbdashboard").is(":visible"))
        self.loadSourceCodeTab(currentSamplepage);
    setTimeout(function () {
        $("#samplefile")[0].contentWindow.focus();
    }, 600);
    $(".sample_wrapper").css("min-height", 0)
    if ($(".control-panel").data("ejWaitingPopup")) {
        var popupObj = $(".control-panel").ejWaitingPopup("instance");
        popupObj.maindiv.find('.sbloadingtemplate').removeAttr('class').addClass('sbloadingtemplate');
        popupObj.hide();
    }
    $('#samplefile').css('visibility', 'visible');
    $('#sourceTab').css('visibility', 'visible');
    $("#edit-wrapper span.e-icon").css('visibility', 'visible');
    $('.control-panel.scrollit').scrollTop(0);
    autoResize("samplefile");
    $("body").attr('class') == 'fixedlayout' ? $("body").removeAttr('class') : $('body').removeClass('fixedlayout');
}
function onClose(args) {

}
function updateHeight() {
    $(".cols-iframe, .sample_wrapper").show();
    $("#footer").show();
}


function preparetheme() {
    var themename = "";
    if (window.location.hash.indexOf('dark') != -1 && window.themevarient != 'light')
        window.themevarient = "dark";
    if (window.location.hash.indexOf('gradient') != -1 && window.themestyle != 'flat')
        window.themestyle = "gradient";
    if (window.themevarient == "dark") {
        if (window.themestyle == "gradient")
            themename = window.themestyle + window.themecolor + window.themevarient;
        else
            themename = (window.themecolor != "") ? window.themecolor + window.themevarient : window.themestyle + window.themevarient;

    }
    else {
        if (window.themestyle == "gradient")
            themename = window.themestyle + window.themecolor;
        else
            themename = (window.themecolor != "") ? window.themecolor : window.themestyle;
    }
    if (window.theme.indexOf("bootstrap") != -1) {
        themename = window.theme;
        window.themestyle = "flat";
        window.themevarient = "light";
    }
    if (window.theme.indexOf("high-contrast-01") != -1) {
        themename = window.theme;
        window.themestyle = "flat";
        window.themevarient = "dark";
    }
    if (window.theme.indexOf("high-contrast-02") != -1) {
        themename = window.theme;
        window.themestyle = "flat";
        window.themevarient = "dark";
    }
    if (window.theme.indexOf("material") != -1) {
        themename = window.theme;
        window.themestyle = "flat";
        window.themevarient = "light";
    }
    if (window.theme.indexOf("office-365") != -1) {
        themename = window.theme;
        window.themestyle = "flat";
        window.themevarient = "light";
    }
    window.theme = themename;
}

function updateTheme(selcolor) {
    preparetheme();
    replacebg(window.themevarient == "dark");
    replaceTheme();
}
var themes = {
    "flat": "content/ejthemes/flat-saffron/ej.widgets.all.min.css",
    "flatdark": "content/ejthemes/flat-azure-dark/ej.widgets.all.min.css",
    "azure": "content/ejthemes/flat-saffron/ej.widgets.all.min.css",
    "azuredark": "content/ejthemes/flat-azure-dark/ej.widgets.all.min.css",
    "lime": "content/ejthemes/flat-lime/ej.widgets.all.min.css",
    "limedark": "content/ejthemes/flat-lime-dark/ej.widgets.all.min.css",
    "saffron": "content/ejthemes/flat-saffron/ej.widgets.all.min.css",
    "saffrondark": "content/ejthemes/flat-saffron-dark/ej.widgets.all.min.css",
    "gradient": "content/ejthemes/gradient-azure/ej.widgets.all.min.css",
    "gradientdark": "content/ejthemes/gradient-azure-dark/ej.widgets.all.min.css",
    "gradientazure": "content/ejthemes/gradient-azure/ej.widgets.all.min.css",
    "gradientazuredark": "content/ejthemes/gradient-azure-dark/ej.widgets.all.min.css",
    "gradientlime": "content/ejthemes/gradient-lime/ej.widgets.all.min.css",
    "gradientlimedark": "content/ejthemes/gradient-lime-dark/ej.widgets.all.min.css",
    "gradientsaffron": "content/ejthemes/gradient-saffron/ej.widgets.all.min.css",
    "gradientsaffrondark": "content/ejthemes/gradient-saffron-dark/ej.widgets.all.min.css",
    "bootstrap": "content/ejthemes/bootstrap-theme/ej.widgets.all.min.css",
    "high-contrast-01": "content/ejthemes/high-contrast-01/ej.widgets.all.min.css",
    "high-contrast-02": "content/ejthemes/high-contrast-02/ej.widgets.all.min.css",
    "material": "content/ejthemes/material/ej.widgets.all.min.css",
    "office-365": "content/ejthemes/office-365/ej.widgets.all.min.css"
};
function updateLinkTag() {
    var links = $(document.head || document.getElementsByTagName('head')[0]).find("link");
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("ej.widgets.all.min.css") != -1)
            links[i].href = themes[theme];
    }
}
function replaceTheme() {
    if ((window.theme.indexOf("lime") != -1) || (window.location.hash.indexOf('lime') != -1 && window.themecolor != 'azure' && window.themecolor != "saffron"))
        window.themecolor = 'lime';
    else if ((window.theme.indexOf('saffron') != -1) || (window.location.hash.indexOf('saffron') != -1 && window.themecolor != 'azure' && window.themecolor != 'lime'))
        window.themecolor = 'saffron';
    else if ((window.theme.indexOf('high-contrast-01') != -1))
        window.themecolor = 'high-contrast-01';
    else if ((window.theme.indexOf('high-contrast-02') != -1))
        window.themecolor = 'high-contrast-02';
    else if ((window.theme.indexOf('material') != -1))
        window.themecolor = 'material';
    else if ((window.theme.indexOf('office-365') != -1))
        window.themecolor = 'office-365';
    else
        window.themecolor = "azure";
    var selcolor = (window.themecolor == "") ? "azure" : window.themecolor;
    $(".htmljssamplebrowser").attr("class", "htmljssamplebrowser " + selcolor);
    updateLinkTag();
    if (window.currentSamplepage) {
        var querystring = "";
        if (window.theme != "flat") {
            querystring = "?theme=" + window.theme;
        }
        $("#samplefile").attr('src', currentSamplepage + querystring);
        $("#newsamplewindow").attr('href', currentSamplepage);
    }
    if (window.location.hash === "")
        window.location.hash = "#!/" + window.theme;
    window.location.hash = window.location.hash.replace(/(#!\/[^\/]+)/, "!/" + window.theme);
}
function replacebg(enable) {
    if (enable)
        $("body").addClass("darktheme");
    else
        $("body").removeClass("darktheme");
}
function onSelectSearchItem(args) {
    var samples = (args.key).split("/");
    var url = "#!/" + window.theme + "/" + args.key;
    $(".samples").hide();
    self.loadLeftTab(samples[0], samples[1]);
    window.location.hash = url;
}
function themebtnClick(args) {
    if (!isPopupOpened) bindUnbindDocClickEvents(true);
    isPopupOpened = $(args.element).hasClass("e-haschild");
    if (isPopupOpened) samplelisthide();
    args.event.stopPropagation();
    var color;
    if (args.ID == 1) {
        var $btnelement = $(window).width() <= 979 ? $("#res_themebutton") : $("#themebutton");
        var pos = $btnelement.offset();
        var left = $btnelement.width() - $(".e-custom-theme .e-horizontal .e-list>ul").width();
        $(".e-custom-theme .e-horizontal .e-list>ul").css('left', left);
    } else {
        this.element.find('li.e-active').removeClass('e-active');
        if ((args.text).toLowerCase().indexOf("bootstrap") !== -1) {
            window.themecolor = "azure";
            window.theme = "bootstrap";
            color = window.theme;
        }
        else if ((args.text).toLowerCase().indexOf("high-contrast-01") !== -1) {
            window.themecolor = "azure";
            window.theme = "high-contrast-01";
            color = window.theme;
        }
        else if ((args.text).toLowerCase().indexOf("high-contrast-02") !== -1) {
            window.themecolor = "azure";
            window.theme = "high-contrast-02";
            color = window.theme;
        }
        else if ((args.text).toLowerCase().indexOf("material") !== -1) {
            window.themecolor = "azure";
            window.theme = "material";
            color = window.theme;
        }
        else if ((args.text).toLowerCase().indexOf("office-365") !== -1) {
            window.themecolor = "azure";
            window.theme = "office-365";
            color = window.theme;
        }
        else {
            if ((args.text.toLowerCase().indexOf("gradient") !== -1)) window.themestyle = "gradient";
            else window.themestyle = "flat";
            if ((args.text).toLowerCase().indexOf("dark") !== -1) window.themevarient = "dark";
            else window.themevarient = "light";
            if ((args.text).toLowerCase().indexOf("azure") !== -1) window.themecolor = window.theme = "azure";
            else if ((args.text).toLowerCase().indexOf("lime") !== -1) window.themecolor = window.theme = "lime";
            else if ((args.text).toLowerCase().indexOf("saffron") !== -1) window.themecolor = window.theme = "saffron";
            color = window.themecolor;
        }
        updateTheme(color);
        $(args.element).addClass("e-active");

    }
}
function samplelisthide() {
    if ($(window).width() < 981) {
        if (window.isTransitionSupported) $('.accordion-panel').css({ left: '-250px' });
        else $(".accordion-panel").animate({ "left": "-250px" }, 350);
        $('.control-panel.cols-content-fluid').addClass('center-flow');
    }
    else {
        if (window.isTransitionSupported) $('.accordion-panel').css({ left: '0px' });
        else $(".accordion-panel").animate({ "left": "0px" }, 350);
    }
}
function showTooltipbox() {
    var $btnelement = $(window).width() <= 979 ? $("#res_themebutton") : $("#themebutton");
    var pos = $btnelement.offset();
    var left = $("#sbtooltipbox_wrapper").width() + pos.left;
    if (left > $(".samplecontainerparent").width())
        left = (pos.left + ($btnelement.width() / 2)) - $("#sbtooltipbox_wrapper").width();
    else
        left = pos.left;
    $("#sbtooltipbox").ejDialog("option", "position", { X: left + 10, Y: pos.top + $btnelement.height() + 7 });
    $("#sbtooltipbox").ejDialog("open");
    setTimeout(function () {
        $("#sbtooltipbox").ejDialog("close");
    }, 3000);
}

function themeButtonSelect() {
    if ((window.theme.indexOf("lime") != -1) || (window.location.hash.indexOf('lime') != -1)) window.themecolor = 'lime';
    else if ((window.theme.indexOf("saffron") != -1) || (window.location.hash.indexOf('saffron') != -1)) window.themecolor = 'saffron';
    else if ((window.theme.indexOf("bootstrap") != -1) || (window.location.hash.indexOf('bootstrap') != -1)) window.themecolor = 'bootstrap';
    else if ((window.theme.indexOf("high-contrast-01") != -1) || (window.location.hash.indexOf('high-contrast-01') != -1)) window.themecolor = 'high-contrast-01';
    else if ((window.theme.indexOf("high-contrast-02") != -1) || (window.location.hash.indexOf('high-contrast-02') != -1)) window.themecolor = 'high-contrast-02';
    else if ((window.theme.indexOf("material") != -1) || (window.location.hash.indexOf('material') != -1)) window.themecolor = 'material';
    else if ((window.theme.indexOf("office-365") != -1) || (window.location.hash.indexOf('office-365') != -1)) window.themecolor = 'office-365';
    else window.themecolor = 'azure';
    if ((window.location.hash.indexOf("gradient") !== -1)) window.themestyle = "gradient";
    else window.themestyle = "flat";
    if ((window.location.hash.indexOf("dark") !== -1)) window.themevarient = "dark";
    else window.themevarient = "light";
    theme = (themestyle == "flat" ? "" : themestyle) + themecolor + (themevarient == "light" ? "" : themevarient);
    updateLinkTag();
}
function queryChange(hashBang) {
    if (hashBang != null)
        window.location.hash = hashBang.replace("flat", window.theme);
}
function adjustpopupposition(args) {
    var offset = $("#selectControls_dropdown").offset();
    var height = $("#selectControls_wrapper").height();
    $("#selectControls_popup").css("top", (offset.top + height + 14) + "px");
    var left = $("#selectControls_popup").width() + offset.left;
    if (left > $(".content-container-fluid").width())
        left = (offset.left + $("#selectControls_dropdown").width()) - $("#selectControls_popup").width() - 12;
    $("#selectControls_popup").css("left", left + "px");
}
function viewdemo(product) {
    product = product.toLowerCase();
    if (window.jsonline) { if (product == "desktop") return; else window.location.href = "http://js.syncfusion.com/demos/mobile/"; }
    else
    {
		if (location.protocol == "file:") {
			if (product == "desktop") return;
			else  window.location.href = "../../ionic%20samples/desktop/www/index.html";
		}
		else if (location.toString().indexOf("sfjavascriptsamplebrowser") != -1) {
			if (product == "desktop") return;
			else window.location.href = "http://localhost:" + window.location.port + "/sfionicjsdesktop"
		} 
        else {
            var links = $(document.head || document.getElementsByTagName('head')[0]).find("link");
            var serverconfig = links[0].href.substr(0, links[0].href.indexOf("content") - 1); 

            var text = 'StartDevServer.ashx', prot = window.location.protocol, hostname = window.location.host;
            if (product == "desktop") return; else product = "mobile";     
            var path = "JavaScript\\ionic samples\\desktop\\www";
            $.ajax({
                async:false,
                url: serverconfig + "/" + text + "?product=ionic" + "&path=" + path,
                success: function (data) {
                    if (product == "mobile") window.location =  data + "/index.html?platform=js";
                }
            });
        }
    }
}
function autoResize(id) {
    var newheight;
    if ($("#" + id + ":visible")) {
        newheight = (!ej.isNullOrUndefined(window.currentSamplepage) && window.currentSamplepage.indexOf("spreadsheet") >= 0 && window.currentSamplepage.indexOf("adaptive") < 0) ? 530 : $(document.getElementById(id).contentWindow.document.body).height();
    }
    $("#" + id).height(newheight + 20);
}


function initiateCopyHandler() {
    try {
        var client = new ZeroClipboard($('#copyclipboard'));
        var time;
        client.on('ready', function (event) {
            client.on('copy', function (event) {
                event.clipboardData.setData('text/plain', copycontent());
                $("#copy-alert").removeClass("hideEl elementToFadeIn elementToFadeOut");
                $("#copy-alert").addClass("elementToFadeIn")
                setTimeout(function () {
                    $("#copy-alert").addClass("elementToFadeOut hideEl");
                }, 1000)
            });
        });
        client.on('error', function (event) {
            console.log('ZeroClipboard error of type "' + event.name + '": ' + event.message);
            ZeroClipboard.destroy();
        });

        function copycontent(e) {
            if ($("#copytextarea").val() == "" || $("#copytextarea").val() == null) {
                $("#copytextarea").val("");
                $("#sourceTab >div:visible").each(function () { $("#copytextarea").val($("#copytextarea").val() + $(this).text().replace("Copy", "")); });
            }
            return $("#copytextarea").val();
        }

    }
    catch (e) { }
}

function codeMirrorModes(url) {
    var extn = url.substr(url.lastIndexOf(".") + 1, url.length).toLowerCase();
    switch (extn) {
        case "html":
        case "xml": return "text/html"; break;
        case "css":
        case "less": return "text/css"; break;
        case "js":
        case "ts": return "javascript"; break;
        case "ashx":
        case "cs": return "text/x-csharp"; break;
        default: return "text/html";

    }
}


window.menuData = [{ id: 1, text: "", parentId: null, spriteCssClass: "e-icon" },
                    { id: "flatazure", text: "Flat-Azure", parentId: 1, spriteCssClass: "SB-theme SB-flat-azure" },
                    { id: "flatazuredark", text: "Flat-Azure-Dark", parentId: 1, spriteCssClass: "SB-theme SB-flat-azure-dark" },
                    { id: "flatlime", text: "Flat-Lime", parentId: 1, spriteCssClass: "SB-theme SB-flat-lime" },
                    { id: "flatlimedark", text: "Flat-Lime-Dark", parentId: 1, spriteCssClass: "SB-theme SB-flat-lime-dark" },
                    { id: "flatsaffron", text: "Flat-Saffron", parentId: 1, spriteCssClass: "SB-theme SB-flat-saffron" },
                    { id: "flatsaffrondark", text: "Flat-Saffron-Dark", parentId: 1, spriteCssClass: "SB-theme SB-flat-saffron-dark" },
                    { id: "gradientazure", text: "Gradient-Azure", parentId: 1, spriteCssClass: "SB-theme SB-gradient-azure" },
                    { id: "gradientazuredark", text: "Gradient-Azure-Dark", parentId: 1, spriteCssClass: "SB-theme SB-gradient-azure-dark" },
                    { id: "gradientlime", text: "Gradient-Lime", parentId: 1, spriteCssClass: "SB-theme SB-gradient-lime" },
                    { id: "gradientlimedark", text: "Gradient-Lime-Dark", parentId: 1, spriteCssClass: "SB-theme SB-gradient-lime-dark" },
                    { id: "gradientsaffron", text: "Gradient-Saffron", parentId: 1, spriteCssClass: "SB-theme SB-gradient-saffron" },
                    { id: "gradientsaffrondark", text: "Gradient-Saffron-Dark", parentId: 1, spriteCssClass: "SB-theme SB-gradient-saffron-dark" },
                    { id: "bootstrap", text: "Bootstrap", parentId: 1, spriteCssClass: "SB-theme SB-bootstrap" }
					//{ id: "highcontrast01", text: "High-Contrast-01", parentId: 1, spriteCssClass: "SB-theme SB-high-contrast-01" },
					//{ id: "highcontrast02", text: "High-Contrast-02", parentId: 1, spriteCssClass: "SB-theme SB-high-contrast-02" },
					//{ id: "material", text: "Material", parentId: 1, spriteCssClass: "SB-theme SB-material" },
					//{ id: "office365", text: "Office-365", parentId: 1, spriteCssClass: "SB-theme SB-office365" }

];