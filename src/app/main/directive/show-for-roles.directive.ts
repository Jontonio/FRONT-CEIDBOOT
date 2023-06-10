import { Directive, Input, ViewContainerRef, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { map, distinctUntilChanged, tap, Subscription, of } from 'rxjs';

/** Este será una directiva estructural */

@Directive({
  selector: '[showForRoles]'
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
  @Input('showForRoles') rolesPermitidos?:string[];

  sub$:Subscription;

  constructor(private _auth:AuthService,
              private viewContainerRedf:ViewContainerRef,
              private templateRef:TemplateRef<any>) { }

  ngOnInit(): void {
    const hasRole: boolean = Boolean(this.rolesPermitidos?.includes(this._auth.userAuth!.TipoRol));
    this.sub$ = of(hasRole)
    .pipe(
      distinctUntilChanged(),
      tap((hasRole) => hasRole
        ? this.viewContainerRedf.createEmbeddedView(this.templateRef)
        : this.viewContainerRedf.clear())
    )
    .subscribe();
    // this.sub$ = this._auth.authenticated()
    // .pipe(
    //   map((user) => Boolean(this.rolesPermitidos!.includes(user.user.TipoRol))),
    //   distinctUntilChanged(),
    //   tap((hasRole) => hasRole
    //                    ?this.viewContainerRedf.createEmbeddedView(this.templateRef)
    //                    :this.viewContainerRedf.clear())
    // ).subscribe();
  }

  ngOnDestroy(): void {
    if(this.sub$) this.sub$.unsubscribe();
  }
}
